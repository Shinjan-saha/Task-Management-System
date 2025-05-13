import streamlit as st
import requests

API_BASE = "https://task-management-system-9yg1.onrender.com"  # Change if your backend is hosted elsewhere

# Session state to store token
if "token" not in st.session_state:
    st.session_state.token = None

# Headers with JWT
def get_auth_headers():
    return {"Authorization": f"Bearer {st.session_state.token}"}

# Register a new user
def register():
    st.title("Register")
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")

    if st.button("Register"):
        res = requests.post(f"{API_BASE}/register", json={"username": username, "password": password})
        if res.status_code == 200:
            st.success("Registered! You can now log in.")
        else:
            st.error(res.json().get("error", "Registration failed."))

# Login and get token
def login():
    st.title("Login")
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        res = requests.post(f"{API_BASE}/login", json={"username": username, "password": password})
        if res.status_code == 200:
            st.session_state.token = res.json()["token"]
            st.success("Logged in!")
        else:
            st.error("Login failed.")

# Task management
def task_dashboard():
    st.title("Your Tasks")

    # Load tasks
    res = requests.get(f"{API_BASE}/tasks", headers=get_auth_headers())
    if res.status_code != 200:
        st.error("Failed to load tasks.")
        return
    tasks = res.json()

    # Show tasks
    for task in tasks:
        col1, col2, col3 = st.columns([4, 2, 2])
        with col1:
            st.text_input(f"Title_{task['ID']}", task["Title"], key=f"title_{task['ID']}", disabled=True)
        with col2:
            completed = st.checkbox("Completed", value=task["Completed"], key=f"chk_{task['ID']}")
        with col3:
            if st.button("Update", key=f"update_{task['ID']}"):
                new_title = st.session_state[f"title_{task['ID']}"]
                res = requests.put(f"{API_BASE}/tasks/{task['ID']}", headers=get_auth_headers(),
                                   json={"title": new_title, "completed": completed})
                if res.status_code == 200:
                    st.success("Task updated")
                    st.experimental_rerun()
                else:
                    st.error("Failed to update task")
            if st.button("Delete", key=f"delete_{task['ID']}"):
                res = requests.delete(f"{API_BASE}/tasks/{task['ID']}", headers=get_auth_headers())
                if res.status_code == 200:
                    st.success("Deleted")
                    st.experimental_rerun()
                else:
                    st.error("Failed to delete")

    st.markdown("---")
    st.subheader("Create New Task")
    new_title = st.text_input("New Task Title")
    if st.button("Add Task"):
        if new_title:
            res = requests.post(f"{API_BASE}/tasks", headers=get_auth_headers(), json={"title": new_title})
            if res.status_code == 200:
                st.success("Task added")
                st.experimental_rerun()
            else:
                st.error("Failed to add task")

    st.markdown("---")
    if st.button("Logout"):
        st.session_state.token = None
        st.experimental_rerun()

# Navigation
def main():
    if st.session_state.token:
        task_dashboard()
    else:
        choice = st.sidebar.selectbox("Select", ["Login", "Register"])
        if choice == "Login":
            login()
        else:
            register()

if __name__ == "__main__":
    main()
