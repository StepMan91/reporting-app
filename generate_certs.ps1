# Generate Self-Signed Certificates for Raspberry Pi
param(
    [string]$IP = "192.168.1.141"
)

Write-Host "Generating self-signed certificate for $IP..." -ForegroundColor Cyan

# Create certs directory
New-Item -ItemType Directory -Force -Path "certs" | Out-Null

# OpenSSL configuration file for SAN (Subject Alternative Name)
$opensslConfig = @"
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = FR
ST = State
L = City
O = Organization
OU = OrgUnit
CN = $IP

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
IP.1 = $IP
"@

$opensslConfig | Out-File -Encoding ASCII "certs/openssl.cnf"

# Generate Private Key and Certificate using OpenSSL (assuming git bash or similar is in path, or use built-in if available)
# If openssl is not in path, this might fail. We'll try to use the one from Git if possible.

try {
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
        -keyout certs/server.key `
        -out certs/server.crt `
        -config certs/openssl.cnf
    
    Write-Host "✅ Certificates generated in ./certs/" -ForegroundColor Green
}
catch {
    Write-Error "Failed to generate certificates. Make sure OpenSSL is installed and in your PATH."
    Write-Host "You can install Git for Windows to get OpenSSL."
}
