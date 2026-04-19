import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { submitProblem } from '../api';

const MAX_LENGTH = 4000;
const MIN_LENGTH = 3;

function normalizeInput(value) {
  return value.replace(/\r\n/g, '\n').replace(/[^\S\n]+/g, ' ').trim();
}

function detectMetaPhrase(text) {
  const raw = text.trim();

  if (!raw) {
    return {
      mode: 'empty',
      label: 'No input',
      preview: null,
    };
  }

  const upper = raw.toUpperCase();

  if (
    /^[A-Z0-9_:\-=()[\].,'" /+\n-]+$/i.test(raw) &&
    /SYNAPSE|PROBLEM|SIMULATE|ACTION|RESULT|TIMELINE|PATTERN/.test(upper)
  ) {
    return {
      mode: 'structured',
      label: 'Structured command detected',
      preview: raw,
    };
  }

  if (
    raw.includes(':') &&
    /problem|simulate|action|result|timeline|pattern/i.test(raw)
  ) {
    return {
      mode: 'semi-structured',
      label: 'Command-like input detected',
      preview: raw,
    };
  }

  return {
    mode: 'natural',
    label: 'Natural language problem statement',
    preview: `PROBLEM description="${normalizeInput(raw)}"`,
  };
}

export default function InputBox({ onSubmitted }) {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const abortRef = useRef(null);
  const textareaRef = useRef(null);

  const inputId = useId();
  const helpId = useId();
  const metaId = useId();
  const statusId = useId();

  const normalized = useMemo(() => normalizeInput(problem), [problem]);
  const meta = useMemo(() => detectMetaPhrase(problem), [problem]);

  const charsUsed = problem.length;
  const charsRemaining = MAX_LENGTH - charsUsed;
  const isTooShort = normalized.length > 0 && normalized.length < MIN_LENGTH;
  const isTooLong = charsUsed > MAX_LENGTH;

  const canSubmit = !loading && normalized.length >= MIN_LENGTH && !isTooLong;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function handleSubmit(event) {
    event?.preventDefault?.();

    setError('');
    setSuccessMessage('');

    if (!normalized) {
      setError('Please describe the issue before submitting.');
      return;
    }

    if (normalized.length < MIN_LENGTH) {
      setError(`Please enter at least ${MIN_LENGTH} characters.`);
      return;
    }

    if (charsUsed > MAX_LENGTH) {
      setError(`Input exceeds the ${MAX_LENGTH} character limit.`);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const payload = {
        description: normalized,
        input_mode: meta.mode,
        meta_phrase_preview: meta.preview,
        submitted_at: new Date().toISOString(),
      };

      const result = await submitProblem(payload, controller.signal);

      setProblem('');
      setSuccessMessage('Problem submitted successfully.');

      if (typeof onSubmitted === 'function') {
        onSubmitted(result);
      }

      textareaRef.current?.focus();
    } catch (err) {
      if (err?.message !== 'Request cancelled') {
        setError(err?.message || 'Failed to submit problem.');
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleClear() {
    if (loading) return;

    setProblem('');
    setError('');
    setSuccessMessage('');
    textareaRef.current?.focus();
  }

  function handleChange(event) {
    setProblem(event.target.value);

    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && canSubmit) {
      handleSubmit(event);
    }
  }

  return (
    <section className="input-box" aria-labelledby={`${inputId}-heading`}>
      <div className="panel-header">
        <div>
          <h3 id={`${inputId}-heading`}>Problem Input</h3>
          <p className="panel-subtitle">
            Capture a problem statement or structured command.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className="sr-only">
          Describe the issue or enter a command
        </label>

        <textarea
          id={inputId}
          ref={textareaRef}
          value={problem}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the issue, task, or command..."
          rows={8}
          disabled={loading}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helpId} ${problem.trim() ? metaId : ''} ${statusId}`.trim()}
          spellCheck="true"
          autoCapitalize="sentences"
          autoCorrect="on"
        />

        <div id={helpId} className="input-meta-row">
          <span className={charsRemaining < 120 ? 'warning-text' : 'muted-text'}>
            {charsRemaining >= 0
              ? `${charsRemaining} characters remaining`
              : `${Math.abs(charsRemaining)} characters over limit`}
          </span>

          <span className="muted-text">Mode: {meta.label}</span>
        </div>

        {problem.trim() && meta.preview && (
          <div id={metaId} className="meta-preview-box">
            <div className="meta-preview-label">Preview</div>
            <code>{meta.preview}</code>
          </div>
        )}

        {isTooShort && (
          <div className="validation-hint" role="note">
            Add a little more detail so the system can classify it properly.
          </div>
        )}

        <div className="input-actions">
          <button type="submit" disabled={!canSubmit}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          <button
            type="button"
            className="button-secondary"
            onClick={handleClear}
            disabled={loading || (!problem && !error && !successMessage)}
          >
            Clear
          </button>
        </div>

        <div id={statusId} className="status-stack" aria-live="polite">
          {successMessage ? (
            <div className="success-message">{successMessage}</div>
          ) : null}

          {error ? <div className="error">{error}</div> : null}
        </div>
      </form>
    </section>
  );
}
