import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_auth_login_admin(client: AsyncClient):
    """
    Test authenticating an administrator with system seed parameters.
    """
    response = await client.post("/auth/login", json={
        "email": "admin@airmind.gov.in",
        "password": "admin123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_auth_login_invalid(client: AsyncClient):
    """
    Test authenticating with wrong credentials blocks entry.
    """
    response = await client.post("/auth/login", json={
        "email": "hacker@gmail.com",
        "password": "badpassword"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_dashboard_summary_delhi(client: AsyncClient):
    """
    Test retrieving spatiotemporal AeroBudget logs for Delhi.
    """
    response = await client.get("/dashboard/summary?city=delhi")
    assert response.status_code == 200
    data = response.json()
    assert "cityName" in data
    assert data["cityName"] == "Delhi"
    assert "budget" in data
    assert "capacityTons" in data["budget"]
    assert "usedTons" in data["budget"]

@pytest.mark.asyncio
async def test_simulation_policy_twin(client: AsyncClient):
    """
    Test dispatching a digital twin policy slider scenario run.
    """
    # Authenticate first
    login_resp = await client.post("/auth/login", json={
        "email": "admin@airmind.gov.in",
        "password": "admin123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = await client.post("/simulation", json={
        "roadClosure": 1,
        "reduceTraffic": 30,
        "pauseConstruction": 50,
        "reduceIndustry": 20
    }, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert "aqiReduction" in data
    assert "cost" in data
    assert "healthImpact" in data

@pytest.mark.asyncio
async def test_citizen_health_advisory_profiling(client: AsyncClient):
    """
    Test receiving personalized mask and lung risk warnings.
    """
    response = await client.get("/cities/delhi/health-advisory?age=65&health_profile=asthma")
    assert response.status_code == 200
    data = response.json()
    assert "advisory" in data
    assert "healthRisk" in data["advisory"]
    assert "maskRecommendation" in data["advisory"]

@pytest.mark.asyncio
async def test_copilot_explainable_query(client: AsyncClient):
    """
    Test asking the conversational decision copilot a query.
    """
    response = await client.post("/copilot/query", json={
        "query": "Suggest a routing plan to divert logistics cargo around chemical corridors."
    })
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "🤖" in data["response"] or "🚚" in data["response"]
