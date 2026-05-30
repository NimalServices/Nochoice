import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../utils/api";
import styles from "../css/AdminDashboard.module.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [travels, setTravels] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, carriersRes, travelsRes, usersRes] = await Promise.all([
        axios.get(buildApiUrl("/api/admin/stats"), { headers }),
        axios.get(buildApiUrl("/api/admin/carriers"), { headers }),
        axios.get(buildApiUrl("/api/admin/travels"), { headers }),
        axios.get(buildApiUrl("/api/admin/users"), { headers }),
      ]);
      setStats(statsRes.data);
      setCarriers(carriersRes.data);
      setTravels(travelsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(buildApiUrl(`/api/admin/carriers/${id}/approve`), {}, { headers });
      fetchAll();
    } catch (err) {
      alert("Failed to approve carrier");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this carrier?")) return;
    try {
      await axios.delete(buildApiUrl(`/api/admin/carriers/${id}`), { headers });
      fetchAll();
    } catch (err) {
      alert("Failed to remove carrier");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const pendingCarriers = carriers.filter((c) => !c.approved);
  const approvedCarriers = carriers.filter((c) => c.approved);

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoBox}>C</span>
          <span>Carryz Admin</span>
        </div>

        <nav className={styles.nav}>
          {[
            { key: "overview", label: "Overview" },
            { key: "pending", label: `Pending (${pendingCarriers.length})` },
            { key: "carriers", label: "All Carriers" },
            { key: "travels", label: "Travels" },
            { key: "users", label: "Users" },
          ].map((item) => (
            <button
              key={item.key}
              className={`${styles.navBtn} ${activeTab === item.key ? styles.active : ""}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h2 className={styles.pageTitle}>
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "pending" && "Pending Approvals"}
            {activeTab === "carriers" && "All Carriers"}
            {activeTab === "travels" && "Travel Records"}
            {activeTab === "users" && "All Users"}
          </h2>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && stats && (
          <div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Total Carriers</p>
                <p className={styles.statValue}>{stats.totalCarriers}</p>
              </div>
              <div className={`${styles.statCard} ${styles.warning}`}>
                <p className={styles.statLabel}>Pending Approval</p>
                <p className={styles.statValue}>{stats.pendingCarriers}</p>
              </div>
              <div className={`${styles.statCard} ${styles.success}`}>
                <p className={styles.statLabel}>Approved Carriers</p>
                <p className={styles.statValue}>{stats.approvedCarriers}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Total Travels</p>
                <p className={styles.statValue}>{stats.totalTravels}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Total Users</p>
                <p className={styles.statValue}>{stats.totalUsers}</p>
              </div>
            </div>

            {pendingCarriers.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Pending Approvals</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th><th>NIC</th><th>Category</th><th>Phone</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCarriers.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>{c.nic}</td>
                        <td>{c.category}</td>
                        <td>{c.phone}</td>
                        <td>
                          <button className={styles.approveBtn} onClick={() => handleApprove(c._id)}>Approve</button>
                          <button className={styles.rejectBtn} onClick={() => handleDelete(c._id)}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PENDING */}
        {activeTab === "pending" && (
          <div className={styles.section}>
            {pendingCarriers.length === 0 ? (
              <p className={styles.empty}>No pending carriers.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th><th>NIC</th><th>Category</th><th>Phone</th><th>Joined</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCarriers.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.nic}</td>
                      <td>{c.category}</td>
                      <td>{c.phone}</td>
                      <td>{new Date(c.joinedDate).toLocaleDateString()}</td>
                      <td>
                        <button className={styles.approveBtn} onClick={() => handleApprove(c._id)}>Approve</button>
                        <button className={styles.rejectBtn} onClick={() => handleDelete(c._id)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ALL CARRIERS */}
        {activeTab === "carriers" && (
          <div className={styles.section}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th><th>NIC</th><th>Category</th><th>Phone</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {carriers.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.nic}</td>
                    <td>{c.category}</td>
                    <td>{c.phone}</td>
                    <td>
                      <span className={c.approved ? styles.badgeGreen : styles.badgeYellow}>
                        {c.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td>
                      {!c.approved && (
                        <button className={styles.approveBtn} onClick={() => handleApprove(c._id)}>Approve</button>
                      )}
                      <button className={styles.rejectBtn} onClick={() => handleDelete(c._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TRAVELS */}
        {activeTab === "travels" && (
          <div className={styles.section}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Carrier</th><th>From</th><th>To</th><th>Date</th><th>Bus Time</th><th>Price</th>
                </tr>
              </thead>
              <tbody>
                {travels.map((t) => (
                  <tr key={t._id}>
                    <td>{t.carrierId?.name || "N/A"}</td>
                    <td>{t.fromWhere}</td>
                    <td>{t.toWhere}</td>
                    <td>{new Date(t.travelDate).toLocaleDateString()}</td>
                    <td>{t.BusTime}</td>
                    <td>Rs. {t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className={styles.section}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th><th>NIC</th><th>Role</th><th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.nic}</td>
                    <td>
                      <span className={u.role === "admin" ? styles.badgeBlue : styles.badgeGreen}>
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;