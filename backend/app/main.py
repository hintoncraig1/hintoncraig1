from fastapi import FastAPI

from app.api.routes.governance import router as governance_router

app = FastAPI(title="FORNIX Governance API")
app.include_router(governance_router)
