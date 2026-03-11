# AuditLens Demo Test Data

This folder contains HTML files that simulate real-world IT system administration screens for demonstrating AuditLens. Each file is designed to be opened in a browser and screenshotted — the resulting screenshots can then be imported into AuditLens to showcase the AI-powered analysis features.

## How to Use

1. Open any `.html` file in a web browser (Chrome/Edge recommended)
2. Take a screenshot of the browser content (or use AuditLens capture hotkey)
3. Import the screenshot into AuditLens for AI analysis
4. The AI will detect findings, assign risk levels, and generate recommendations

## Test Data Files

| # | File | Simulates | Key Audit Findings |
|---|------|-----------|-------------------|
| 01 | `01-ad-user-list.html` | Active Directory Users & Computers | Service accounts with "Password Never Expires", stale accounts, excessive privileges |
| 02 | `02-firewall-rules.html` | FortiGate Firewall Policy | ANY/ANY allow rules, RDP exposed externally, unencrypted FTP/Telnet, no security profiles |
| 03 | `03-access-control-list.html` | File Server Share Permissions | "Everyone" with Full Control on financial data, HR PII exposed to all domain users |
| 04 | `04-backup-configuration.html` | Veeam Backup & Replication | Failed backup jobs (SQL & ERP), repository near capacity, disabled job |
| 05 | `05-network-config.html` | Cisco Switch Running Config (terminal) | Plaintext passwords, default SNMP communities, SSHv1, default vendor credentials |
| 06 | `06-windows-event-log.html` | Windows Event Viewer Security Log | Brute force RDP attempts from external IP, privilege escalation, off-hours admin access |
| 07 | `07-sql-server-permissions.html` | SQL Server Management Studio | SA account enabled, excessive sysadmin memberships, SQL auth with unrotated passwords |
| 08 | `08-gpo-password-policy.html` | Group Policy Management (Password Policy) | 6-char minimum password, low history enforcement, weak lockout policy, missing audit policies |
| 09 | `09-aws-iam-policy.html` | AWS IAM Users & Access Report | Root account with no MFA, dormant admin users, inactive contractor with S3 full access |
| 10 | `10-endpoint-protection.html` | CrowdStrike Falcon Endpoint Dashboard | Unprotected production servers, tampered sensors, outdated agents, EOL operating systems |
| 11 | `11-ssl-certificate-status.html` | SSL/TLS Certificate Inventory | Expired certificates (VPN, internal API), weak ciphers (SHA1/1024-bit), certificates expiring soon |
| 12 | `12-privileged-access-review.html` | Privileged Access Review Report | Orphaned admin accounts, contractors with Domain Admin, service accounts with excessive rights |

## Fictional Company Profile

All data is for the fictional **Acme Financial Corp** (`corp.acmefinancial.com`):
- Industry: Financial Services
- Size: ~200 employees
- Infrastructure: Hybrid (on-prem Windows/Linux + AWS)
- Key Systems: Active Directory, SQL Server, Exchange, FortiGate firewalls, Veeam backups, CrowdStrike endpoint protection

## Notes

- All data is completely fictional — no real IP addresses, credentials, or company information
- The HTML files are self-contained with inline CSS (no external dependencies)
- Each file contains intentional security findings at various risk levels for comprehensive demo coverage
- The findings are consistent across files (e.g., the same user accounts appear in AD, event logs, and privileged access review)
