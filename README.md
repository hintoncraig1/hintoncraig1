# Connected Repositories — Technical README

Canonical technical surface for the repositories currently accessible through the connected GitHub account.

## Connector Scope

- **Provider:** GitHub
- **Connected Account:** `hintoncraig1`
- **Connector Visibility:** repositories accessible to the authenticated account
- **Canonical Registry Repo:** `hintoncraig1/hintoncraig1`
- **Document:** `README.md`
- **Mode:** `DIGITALLY_REMASTERED`
- **Status:** `PUBLISHED`

## Executive Technical Summary

This README consolidates the currently accessible repositories into a single operator-facing registry.  
It is designed to function as:

- a connected-repo inventory
- a visibility and access ledger
- a bootstrap surface for future documentation, deployment notes, and repository routing
- a canonical publish artifact for the connected GitHub workspace

## Accessible / Connected Repositories

| Repo | Visibility | Default Branch | Size | Archived | Access |
|---|---|---:|---:|---:|---|
| `hintoncraig1/hintoncraig1` | public | `main` | 57 KB | `false` | `admin,push,pull,maintain,triage` |
| `hintoncraig1/haikus-for-codespaces` | private | `main` | 0 KB | `false` | `admin,push,pull,maintain,triage` |
| `hintoncraig1/dex2jar` | public | `2.x` | 8730 KB | `false` | `admin,push,pull,maintain,triage` |
| `hintoncraig1/E-Mc3_Metatrons` | private | `main` | 0 KB | `false` | `admin,push,pull,maintain,triage` |
| `hintoncraig1/RuBee-Platform` | private | `main` | 0 KB | `false` | `admin,push,pull,maintain,triage` |

## Connected Repository URLs

- `https://github.com/hintoncraig1/hintoncraig1`
- `https://github.com/hintoncraig1/haikus-for-codespaces`
- `https://github.com/hintoncraig1/dex2jar`
- `https://github.com/hintoncraig1/E-Mc3_Metatrons`
- `https://github.com/hintoncraig1/RuBee-Platform`

## Registry Interpretation

### 1. Profile / Canonical Surface
- `hintoncraig1/hintoncraig1` acts as the public-facing registry and connector landing surface.

### 2. Active External Codebase
- `hintoncraig1/dex2jar` is the largest currently connected repository by reported size and uses `2.x` as its default branch.

### 3. Private Build Surfaces
- `hintoncraig1/haikus-for-codespaces`
- `hintoncraig1/E-Mc3_Metatrons`
- `hintoncraig1/RuBee-Platform`

These private repositories are currently visible to the connected account with admin-grade access and can be documented or remastered next.

## Recommended Next Operations

- standardize each repository with a technical `README.md`
- add purpose, architecture, bootstrap, and deployment sections repo-by-repo
- normalize branch strategy and operational metadata
- define which repository is canonical for each project stream
- publish a cross-repo manifest if you want one registry to control all downstream docs

## Publish Manifest

```json
{
  "document": "README.md",
  "version": "2.0.0",
  "timestamp": "2026-04-14T00:00:00Z",
  "hash": "sha256:baf5f4bbd7f9e592ec488ab3ab40cae399dc5913a5259df179bffbccbeacf789",
  "status": "PUBLISHED",
  "merkle_root": "0xbaf5f4bbd7f9e592ec488ab3ab40cae399dc5913a5259df179bffbccbeacf789"
}
```

## Proof Rule

For this single-document publish artifact, the Merkle root is identical to the canonical SHA-256 payload hash.

## Commit Intent

**Do it all in one technical README.md — accessible repos, connected repos.**
