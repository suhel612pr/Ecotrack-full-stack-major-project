# Security Policy for EcoTrack AI Smart City OS

We take the security of our citizens, workers, and municipal operator portals extremely seriously. This document outlines our security policies and reporting procedures.

---

## 🔒 Security Model

EcoTrack is built with the following core security principles:

1. **Role-Based Access Control (RBAC)**: All portals verify profile roles (`citizen`, `worker`, `supervisor`, `admin`) before permitting views, route modifications, or system telemetry updates.
2. **Row-Level Security (RLS)**: Enforced directly on the PostgreSQL database level (Supabase) to restrict access to user-specific logs (`scan_history`, private user details).
3. **API Key Security**: The application never exposes sensitive administrative API keys or database service roles on the client. All communications utilize securely authorized anonymous/user-authenticated keys.

---

## ⚠️ Reporting a Vulnerability

If you discover a security vulnerability in EcoTrack, please do not file a public issue on GitHub. Instead, report it privately:

1. **Email us**: Contact our security engineering team at `security@ecotrack.gov` (placeholder/mock contact for production showcases).
2. **Provide Details**: Include a detailed description of the exploit, proof-of-concept steps, and environment parameters.
3. **Response Timeline**: We aim to acknowledge reports within **24 hours** and provide a patch within **5 business days**.

Thank you for helping keep EcoTrack secure!
