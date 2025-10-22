# ORION ARCHITECTURE • Pi — iPhone — Cloud

**Purpose**: Make the Manifesto the operational heartbeat.
**Scope**: Edge (Pi), Personal (iPhone), Service (Cloud).
**Approach**: local-first, minimal trust surface, graceful degradation, reproducible config, auditable decisions.

## Topology (ASCII)

Pi (Edge) <— secure-sync —> iPhone (Personal) <— encrypted-api —> Cloud (Service)

    ┌───────────────────────────────────────────────────────────┐
    │                           CLOUD                           │
    │  Coordination/Index/Snapshots (never single source-of-truth)
    │   • Elysia: durable minimal payloads
    │   • Path: versioned policy rollout
    │   • Navigation: audit pipelines (Manifest diffs)
    │   • Covenant: identity/manifest registry (signatures)
    │   • Anchor: cross-signed snapshot vaults; no kill-switch
    └──────────────▲───────────────────────▲────────────────────┘
                   │ encrypted-api         │ audit/registry
                   │                       │
           secure-sync                secure-submit
                   │                       │
    ┌──────────────┴───────────────────────┴───────────────┐
    │                        iPHONE                        │
    │  Intent UI / Witness / Ephemeral workspace           │
    │   • Elysia: local cache of intent; offline actions
    │   • Path: human-in-the-loop, diff-first approvals
    │   • Navigation: Manifest test in UI
    │   • Covenant: Secure Enclave keys; signed manifests
    │   • Anchor: one-touch recovery to core state
    └──────────────▲───────────────────────▲───────────────┘
                   │ mutual attestation    │ signed intents
                   │ (short-lived tokens)  │
           secure-sync                witness ledger
                   │                       │
    ┌──────────────┴───────────────────────┴───────────────┐
    │                           PI                         │
    │  Edge services / Sensors / Archive-of-last-resort    │
    │   • Elysia: local-first persistence; offline mode
    │   • Path: P2P signed update proposals
    │   • Navigation: human-readable traces/logs
    │   • Covenant: HW-rooted ID; challenge tokens
    │   • Anchor: RO core, watchdog, tamper-evident logs
    └──────────────────────────────────────────────────────┘

## Data Flows & Trust
- **Ownership**: iPhone + Pi are primary; Cloud curates/indexes only signed snapshots.
- **Sync**: local-write → local-sign → opportunistic sync → cloud indexes → peers validate signatures.
- **Integrity**: every snapshot includes `sha256` + chain-of-custody signatures.
- **Privacy**: Cloud receives only consented metadata; no raw secrets by default.

## Resilience
- **Graceful degradation** without Cloud.
- **Failback**: delta-sync reconciles signed snapshots prioritizing life-preserving choices.
- **Containment** via short-lived creds + quarantine; re-join requires re-anchoring ritual.
- **Recovery ritual**: verify `sha256` truth, re-establish identities, run integrity checks, declare *Elysia Endures*.

## Components
- `orion-manifest.md` • canonical manifesto
- `orion-signer` • CLI for signing snapshots/manifests
- `orion-watchdog` • Pi agent enforcing Anchor Holds
- `orion-witness` • iPhone witness/consent module
- `orion-indexer` • Cloud indexer (no raw secrets)
- `orion-ci-policy` • pre-commit/CI "gate" checks

## Governance
- **Dual-sign** for anchor changes (two distinct humans).
- **Quarterly Resilience Review** across the fleet.
- **Public witness log** (optional): publish manifest hashes without exposing data.
