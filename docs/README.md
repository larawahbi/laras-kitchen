# Business Analysis · Lara's Kitchen

This folder holds the analysis behind the project: why it exists, what it does, how it is sequenced, and the data model it stands on. It is written to a professional standard and kept honest. Status is drawn from a code audit and the author's manual checks. Anything that could not be verified from the code is marked as such rather than asserted.

## Contents

| Document | What it covers |
|---|---|
| [Business case](./business-case.md) | The problem, the proposition, and the case for building it |
| [Roadmap](./roadmap.md) | The staged release plan, Foundation through Phase 5 |
| [Requirements](./requirements.md) | Epics, the requirements ledger, and MoSCoW priorities |
| [RAID log](./raid-log.md) | Risks, assumptions, issues, dependencies, and open decisions |
| [Architecture](./architecture.md) | System context and the main process flows |
| [Data model](./data-model.md) | Current state, target relational model, and an ERD |

## How to read it

Near-term work (Foundation and Phase 1) is documented in full. Later phases are described in less detail by design. They gain detail as they approach build, which is deliberate progressive elaboration.

The headline data story is in the [data model](./data-model.md): ingredient quantities are moving from free text into a relational model, because portion scaling, nutrition, and shopping all depend on quantities the code can actually read.
