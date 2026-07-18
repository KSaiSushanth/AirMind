from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.config.database import get_collection
from app.schemas.alert import AlertCreate, AlertOut, AlertUpdate
from app.middleware.auth import get_current_user, require_roles
from bson import ObjectId
from typing import List
from datetime import datetime

router = APIRouter(prefix="/alerts", tags=["Emergency Alerts"])

@router.post("", response_model=AlertOut, status_code=status.HTTP_201_CREATED)
async def create_alert(data: AlertCreate, current_user: dict = Depends(require_roles(["admin", "traffic"]))):
    """Creates a new emergency alert. Restricted to Government and Traffic managers."""
    alerts_col = get_collection("alerts")
    alert_doc = {
        "city": data.city.lower(),
        "title": data.title,
        "desc": data.desc,
        "severity": data.severity,
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "status": "active"
    }
    result = await alerts_col.insert_one(alert_doc)
    alert_doc["id"] = str(result.inserted_id)
    alert_doc.pop("_id", None)
    return alert_doc

@router.get("", response_model=List[AlertOut])
async def list_alerts(city: str = Query(...)):
    """Retrieves all active and resolved alerts for a specified city air-shed."""
    alerts_col = get_collection("alerts")
    cursor = alerts_col.find({"city": city.lower()}).sort("timestamp", -1)
    alerts = []
    async for a in cursor:
        a["id"] = str(a["_id"])
        a.pop("_id", None)
        alerts.append(a)
    return alerts

@router.put("/{alert_id}", response_model=AlertOut)
async def update_alert(alert_id: str, data: AlertUpdate, current_user: dict = Depends(require_roles(["admin", "traffic"]))):
    """Updates an alert's status (e.g., resolving it). Restricted to Admin/Traffic roles."""
    alerts_col = get_collection("alerts")
    try:
        oid = ObjectId(alert_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Alert ID format.")
        
    result = await alerts_col.find_one_and_update(
        {"_id": oid},
        {"$set": {"status": data.status}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found.")
        
    result["id"] = str(result["_id"])
    result.pop("_id", None)
    return result

@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alert(alert_id: str, current_user: dict = Depends(require_roles(["admin"]))):
    """Deletes an alert from the system permanently. Restricted to Administrator role."""
    alerts_col = get_collection("alerts")
    try:
        oid = ObjectId(alert_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Alert ID format.")
        
    result = await alerts_col.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found.")
    return None
