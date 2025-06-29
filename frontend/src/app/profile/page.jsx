"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Settings as SettingsIcon,
  History,
  Grid2x2,
  Bell,
  ChevronDown,
  Mail,
  PhoneCall,
  MapPin,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import "./page.css";

export default function EchoProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    city: "",
    postcode: "",
    bio: "",
  });

  const handle = (field) => (e) =>
    setProfile({ ...profile, [field]: e.target.value });

  const NavLink = ({ icon: Icon, label, href, active }) => (
    <Link href={href} className={`nav-link ${active ? "active" : ""}`}>
      <Icon size={16} />
      {label}
    </Link>
  );

  const IconBtn = ({ icon: Icon, notification }) => (
    <button className="icon-btn">
      <Icon size={20} />
      {notification && <span className="dot" />}
    </button>
  );

  const Stat = ({ label, value }) => (
    <div className="stat">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

  const Field = ({ label, value, onChange, icon: Icon }) => (
    <div className="field">
      <label>{label}</label>
      <div className="input-wrap">
        {Icon && <Icon size={14} className="input-icon" />}
        <input
          value={value}
          onChange={onChange}
          placeholder={label}
          style={Icon ? { paddingLeft: "34px" } : undefined}
        />
      </div>
    </div>
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src="/echo-logo.svg" alt="logo" />
          <span>echo class</span>
        </div>
        <nav className="top-actions">
          <img
            src="https://flagcdn.com/us.svg"
            alt="us"
            className="flag"
            width={28}
          />
          <IconBtn icon={Grid2x2} />
          <IconBtn icon={SettingsIcon} />
          <IconBtn icon={Bell} notification />
          <div className="avatar-box">
            <img
              src="https://avatars.dicebear.com/api/avataaars/user.svg"
              alt=""
            />
            <ChevronDown size={16} />
          </div>
        </nav>
      </header>

      <div className="body">
        <aside className="sidebar">
          <NavLink icon={LayoutDashboard} label="Dashboard" href="/teacher-dashboard" />
          <NavLink icon={GraduationCap} label="Classes" href="/teacher-classes" />
          <NavLink icon={Award} label="Certificate" href="/teacher-classes" />
          <NavLink icon={SettingsIcon} label="Settings" href="/settings" />
          <NavLink icon={History} label="History" href="/teacher-classes" />
        </aside>

        <main className="main">
          <div className="cover" />

          <section className="grid">
            <div className="card profile">
              <div className="avatar-zone">
                <img
                  src="https://avatars.dicebear.com/api/avataaars/user.svg"
                  alt=""
                />
                <button
                  className="cam-btn"
                  onClick={() => alert("Upload functionality coming soon!")}
                >
                  <CameraIcon />
                </button>
              </div>
              <Stat label="Classes Attended" value={0} />
              <Stat label="Classes Joined" value={0} />
              <Stat label="Classes Skipped" value={0} />
              <button
                className="btn-outline full"
                onClick={() =>
                  window.open("https://avatars.dicebear.com/api/avataaars/user.svg", "_blank")
                }
              >
                View Profile Photo
              </button>
            </div>

            <div className="card form">
              <h3>Update details</h3>
              <form className="form-grid">
                <Field
                  label="First Name"
                  value={profile.firstName}
                  onChange={handle("firstName")}
                />
                <Field
                  label="Last Name"
                  value={profile.lastName}
                  onChange={handle("lastName")}
                />
                <Field
                  icon={PhoneCall}
                  label="Mobile"
                  value={profile.mobile}
                  onChange={handle("mobile")}
                />
                <Field
                  icon={Mail}
                  label="E‑Mail"
                  value={profile.email}
                  onChange={handle("email")}
                />
                <Field
                  icon={MapPin}
                  label="City"
                  value={profile.city}
                  onChange={handle("city")}
                />
                <Field
                  label="Postcode"
                  value={profile.postcode}
                  onChange={handle("postcode")}
                />
                <div className="field bio">
                  <label>Bio</label>
                  <div className="input-wrap">
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={handle("bio")}
                      placeholder="Tell us a bit about yourself…"
                    />
                    <Pencil size={14} className="ta-icon" />
                  </div>
                </div>
              </form>
              <div className="right">
                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => {
                    console.log("Profile Updated", profile);
                    alert("Your profile has been updated!");
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14">
    <path d="M5 7h2.6l1.7-1.7A1 1 0 0 1 10.4 5h3.2a1 1 0 0 1 .7.3L16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm7 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
  </svg>
);
