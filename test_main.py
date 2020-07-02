from Flask_App import create_app


def test_scenario1(client):
    response = client.get('/')
    assert b'Summarize!' in response.data
