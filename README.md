# Launchbelt Platform – Demo Environment

This repository contains the codebase for the **Launchbelt platform demo environment**.

The demo is a functional, explorable representation of the Launchbelt operating system, designed to show how aerospace and defense programs move from program intent to manufacturing execution and mission visibility.

This is **not a production system**. It is a controlled demo environment used for platform development, validation, and external reviews.

---

## Overview

Launchbelt is a role-based operational platform that connects:

- Engineering and program leadership
- Manufacturing and integration facilities
- Production floor execution
- Government and mission users

The demo environment exposes these workflows through four distinct modules, all backed by a shared execution and data model.

Live demo and documentation:
**https://launchbelt.space**

---

## Platform Modules

### 1. Launchbelt Command  
**Audience:** Engineering leadership, program managers, executives

Command is the program control and oversight layer. It provides visibility into:
- Active programs and work packages
- RFQs and RFPs
- Program spend versus budget
- Execution status and delivery risk
- Network-level visibility of where work is being performed

This module is used for decision-making and accountability, not factory execution.

---

### 2. Launchbelt Forge  
**Audience:** Manufacturing operations, factory managers, quality and supply chain teams

Forge is the manufacturing operating system. It manages:
- Work orders and routing
- Work in progress (WIP)
- Equipment and capacity
- Supply chain and material risk
- Quality, certification, and inspection
- Integration, test, shipping, and release

Forge represents how a modern aerospace facility operates day to day.

---

### 3. Launchbelt Execute  
**Audience:** Machinists, technicians, inspectors

Execute is a kiosk-style, floor-level interface designed for simplicity and clarity.

It provides:
- Station-based workflows (CNC, additive, autoclave, certification)
- Visual, step-by-step work instructions
- Safety and setup guidance
- Quality issue flagging and escalation
- Supervisor and support workflows

This module is intentionally constrained and execution-focused.

---

### 4. Launchbelt Atlas  
**Audience:** Government and mission users (e.g. Space Force)

Atlas is the mission-facing acquisition and visibility interface.

It allows users to:
- Define mission needs
- Explore approved solutions and suppliers
- Compare systems by cost, schedule, and readiness
- Issue RFPs and RFQs to multiple companies
- Track proposal responses
- Monitor execution after award

Atlas is not a marketplace. Transactions occur directly between buyers and suppliers. Launchbelt provides coordination and visibility.

---

## Demo Environment Notes

- All data in this environment is **representative demo data**
- No live manufacturing, financial, or government systems are connected
- No device permissions (camera, microphone, location) are required
- The demo is designed to be explored without authentication

The platform is actively evolving as we transition toward an alpha release with higher data fidelity.

---

## Tech Stack (High Level)

- Next.js (React)
- TypeScript
- Tailwind CSS
- Component-based UI architecture

The codebase is structured as a single application with role-based module separation.

---

## Local Development

### Prerequisites
- Node.js 18 or newer
- npm

### Install
```bash
npm install
