# Role Preview Test Matrix (Preview App As)

| Scenario | Admin | Manager | Staff | Expected result |
|---|---:|---:|---:|---|
| View Locations Admin | ✅ | ❌ | ❌ | Only Admin can access |
| Approve reservation | ✅ | ✅ | ❌ | Admin/Manager allowed |
| Assign workstation | ✅ | ✅ | ❌ | Admin/Manager allowed |
| Create reservation | ✅ | ✅ | ✅ | All roles can create their own requests |
| View all reports | ✅ | ✅ | ❌ | Staff should see only personal usage info |
| Edit policy rules | ✅ | ❌ | ❌ | Admin only |
| Check-in/out approved booking | ✅ | ✅ | ✅ | Allowed when reservation is approved |
