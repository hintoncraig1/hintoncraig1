# AppSheet Deployment Readiness Checklist

Use this checklist before moving the app from development to deployed state.

## Mandatory checks

- [x] **Data Check**: All tables define a unique key column (`*_id`) in schema design.
- [x] **Security Check**: Security filters are required for sensitive tables; do not rely only on Show If.
- [x] **Information Check**: About page includes usage instructions and support contact fields.
- [x] **Branding Check**: Theme/brand includes primary colors, app logo, and launch image.
- [x] **Sync Check**: Offline/airplane-mode behavior is tested and documented.
- [x] **Role Testing**: Preview as Admin, Manager, Staff using role-test matrix.
- [x] **Deployment Check**: Run Manage → Deploy deployment check and resolve all red errors.
- [x] **Move to Deployed State**: Deploy app to enable full automation and remove prototype limits.
- [x] **Share**: Add domain users via Share with User roles (not co-author) where appropriate.

## Evidence artifacts

- `docs/appsheet/DATA_KEYS_AND_SECURITY.md`
- `docs/appsheet/ROLE_PREVIEW_TEST_MATRIX.md`
- `docs/appsheet/APPSHEET_SETTINGS_PROFILE.md`
