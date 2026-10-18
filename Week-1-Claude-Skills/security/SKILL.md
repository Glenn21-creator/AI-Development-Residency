---
name: security
description: "Build secure software and web applications: defend against the OWASP Top 10, protect personal data per the GDPR, and apply strong authentication and encryption requirements."
---

# Security

Use this skill whenever you create or change software or a web application. Treat security as a design constraint from the start, not a review at the end. Build against the OWASP Top 10 (section 1), protect personal data under the GDPR (section 2), and meet the authentication and encryption requirements (section 3). Run the pre-delivery checks in section 4 before handing anything over.

Core mindset: **never trust input, grant least privilege, fail safely, and defend in depth.**

## 1. Check against the OWASP Top 10 (2025)

The OWASP Top 10 is the industry list of the most critical web application security risks. The current edition is **OWASP Top 10:2025** (released November 2025), which replaces the 2021 list. Review the design and code against every category:

| # | Category | What to do |
|---|----------|-----------|
| **A01** | **Broken Access Control** | Enforce authorization server-side on every request; deny by default; check ownership of each resource. (SSRF is now folded in here — validate and restrict all server-initiated requests.) |
| **A02** | **Security Misconfiguration** | Harden defaults; disable unused features/ports; remove default accounts; set security headers; keep error messages generic. |
| **A03** | **Software Supply Chain Failures** | Pin and verify dependencies; scan them (SCA); use lockfiles and signed packages; watch for compromised build tools and CI/CD. |
| **A04** | **Cryptographic Failures** | Encrypt data in transit and at rest; use strong, current algorithms; manage keys properly (see section 3). |
| **A05** | **Injection** | Use parameterized queries / prepared statements; validate and encode all input; never build queries or commands by string concatenation (SQL, NoSQL, OS, LDAP, XSS). |
| **A06** | **Insecure Design** | Threat-model early; apply secure design patterns; build in rate limiting and abuse resistance by design, not as a patch. |
| **A07** | **Authentication Failures** | Enforce MFA, strong session handling, and protection against credential stuffing and brute force (see section 3). |
| **A08** | **Software or Data Integrity Failures** | Verify integrity of updates, plugins, and deserialized data; use signatures; don't deserialize untrusted data. |
| **A09** | **Security Logging and Alerting Failures** | Log security-relevant events, monitor them, and alert on suspicious activity — without logging secrets or personal data in the clear. |
| **A10** | **Mishandling of Exceptional Conditions** | Handle errors and edge cases deliberately; fail securely (deny on error); never leak stack traces or internal detail to users. |

Reference the official list before relying on details: https://owasp.org/www-project-top-ten/

## 2. Protect personal data under the GDPR

If the product handles **personal data** of people in the EU/EEA (or you adopt GDPR as the standard), apply it. Personal data = any information relating to an identifiable person.

### The seven principles

1. **Lawfulness, fairness, and transparency** — have a valid reason to process data and be clear with people about it.
2. **Purpose limitation** — collect data for specified, explicit purposes; don't reuse it for incompatible ones.
3. **Data minimisation** — collect only what you actually need.
4. **Accuracy** — keep data correct and up to date; allow correction.
5. **Storage limitation** — keep data only as long as needed; then delete or anonymise.
6. **Integrity and confidentiality (security)** — protect data with appropriate technical and organisational measures (ties directly to sections 1 and 3).
7. **Accountability** — be able to demonstrate compliance (records, policies, decisions).

### Build requirements

- **Lawful basis**: identify one before processing (e.g. consent, contract, legal obligation, legitimate interests). For consent, make it freely given, specific, informed, and as easy to withdraw as to give.
- **Data protection by design and by default**: privacy is the default setting; minimise data and exposure in the architecture itself.
- **Data subject rights**: support access, rectification, erasure ("right to be forgotten"), restriction, portability (export), and objection. Design so these can actually be fulfilled.
- **Breach readiness**: be able to detect, contain, and report a personal-data breach to the supervisory authority within **72 hours** where required.
- **Records & DPIAs**: keep records of processing; run a Data Protection Impact Assessment for high-risk processing.
- **Transfers & processors**: safeguard international data transfers; bind third-party processors by contract.
- **Minimise and pseudonymise**: avoid storing personal data you don't need; pseudonymise or anonymise where possible.

Reference: https://gdpr.eu/ · official text at https://eur-lex.europa.eu/eli/reg/2016/679/oj

## 3. Authentication and encryption requirements

### Authentication

- **Don't roll your own.** Use well-tested libraries and standards (OAuth 2.0 / OpenID Connect) rather than custom auth.
- **Multi-factor authentication (MFA)** for all accounts where feasible, and required for privileged/admin access.
- **Password handling**: follow modern (NIST) guidance — favour length over forced complexity, check new passwords against known-breached lists, and do **not** force arbitrary periodic rotation.
- **Never store passwords in plaintext or with fast/general hashes.** Use a dedicated password hash: **Argon2id** (preferred), **bcrypt**, or **scrypt**, each with a unique salt.
- **Session management**: generate strong random session IDs; set cookies `HttpOnly`, `Secure`, and `SameSite`; expire idle and absolute sessions; invalidate on logout and on password change.
- **Protect the login**: rate-limit and throttle; defend against credential stuffing and brute force; lock or slow accounts after repeated failures.
- **Secure account recovery**: time-limited, single-use reset tokens; never reveal whether an account exists.
- **Authorization ≠ authentication**: after proving identity, still enforce least-privilege access on every action (ties to A01).

### Encryption

- **In transit**: enforce **TLS 1.2 or higher** (prefer **TLS 1.3**) everywhere; redirect HTTP→HTTPS; enable **HSTS**. No sensitive data over unencrypted channels.
- **At rest**: encrypt sensitive data and backups with strong algorithms — **AES-256** (symmetric) or equivalent.
- **Don't invent crypto.** Use vetted libraries and current, standard algorithms; avoid deprecated ones (MD5, SHA-1, DES, RC4).
- **Key management**: store keys separately from data (a secrets manager / KMS / vault); rotate keys; never hard-code keys, passwords, or tokens in source or config committed to git.
- **Secrets hygiene**: keep secrets out of logs, URLs, and error messages; use environment variables or a secrets store; scan the repo for leaked secrets.
- **Hashing vs encryption**: hash passwords (one-way, salted); encrypt data you need to read back later. Don't confuse the two.

## 4. Pre-delivery security review

Before handing over, confirm and report:

- **OWASP Top 10**: each category reviewed; findings fixed or explicitly noted (section 1).
- **Dependencies**: scanned for known vulnerabilities; none critical left unaddressed.
- **GDPR / data protection**: lawful basis, data minimisation, subject rights, and retention handled (section 2) — if personal data is involved.
- **Authentication & encryption**: MFA, password hashing, TLS, at-rest encryption, and secrets management in place (section 3).
- **Secrets check**: no credentials, keys, or tokens committed to the repository.
- **Known limitations or open questions** for the user — never hide an unresolved risk.

Keep the summary brief — a few lines — unless the user asks for a full report. Flag anything that needs a security specialist or formal audit rather than overstating assurance.
