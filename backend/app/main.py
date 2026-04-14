from fastapi import FastAPI

from app.api.routes.governance import router as governance_router
from app.api.routes.pios import router as pios_router
from app.db.session import engine
from app.models.sql_models import Base

app = FastAPI(title="FORNIX Governance API")
Base.metadata.create_all(bind=engine)
app.include_router(governance_router)
app.include_router(pios_router)
