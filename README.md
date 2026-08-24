# Leave Management System (Serverless AWS)

[![Frontend CI/CD](https://github.com/pratham1357/leave-management-system/actions/workflows/frontend-ci-cd.yml/badge.svg)](https://github.com/pratham1357/leave-management-system/actions/workflows/frontend-ci-cd.yml)
[![Backend CI/CD](https://github.com/pratham1357/leave-management-system/actions/workflows/backend-ci-cd.yml/badge.svg)](https://github.com/pratham1357/leave-management-system/actions/workflows/backend-ci-cd.yml)

A cloud-native **Leave Management System** built using AWS serverless services that enables employees to apply for leave, managers to review requests, and organizations to manage leave balances efficiently. The application follows a scalable, event-driven architecture and demonstrates backend engineering principles using AWS.

---

## 📌 Overview

This project automates the complete leave approval workflow while enforcing business rules such as leave quotas, overlapping leave validation, and approval/rejection handling.

The system is designed using a serverless architecture to minimize infrastructure management while providing scalability, reliability, and low operational overhead.

---

## ✨ Features

* Employee leave application
* Multiple leave types

  * Casual Leave
  * Sick Leave
  * Earned Leave
  * Unpaid Leave
* Automatic leave quota validation
* Overlapping leave request detection
* Manager approval and rejection workflow
* Leave status tracking
* Input validation
* RESTful API endpoints
* Serverless deployment using AWS Lambda

---

## 🛠️ Tech Stack

### Backend

* Python
* AWS Lambda

### Cloud Services

* Amazon API Gateway
* Amazon DynamoDB
* AWS Lambda

### Development Tools

* Git
* GitHub
* JSON

---

## 🏗️ System Architecture

```text
                Employee
                    │
                    ▼
          Amazon API Gateway
                    │
                    ▼
              AWS Lambda
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
 Business Logic Validation Leave Rules
                    │
                    ▼
           Amazon DynamoDB
                    │
                    ▼
            Response to User
```

---

## 📋 Business Rules

* Employees cannot exceed their leave quota.
* Overlapping leave requests are rejected.
* Different leave types maintain independent balances.
* Every leave request is assigned a unique identifier.
* Managers can approve or reject requests.
* Leave balances are updated automatically after approval.

---

## 🌐 API Endpoints

### Apply Leave

```http
POST /leave/apply
```

Creates a new leave request after validating:

* Employee ID
* Leave dates
* Leave quota
* Overlapping requests

---

### Approve Leave

```http
POST /leave/approve
```

Approves a pending leave request and updates leave balances.

---

### Reject Leave

```http
POST /leave/reject
```

Rejects a pending leave request.

---

### Get Leave Status

```http
GET /leave/{leave_id}
```

Returns the current status of a leave request.

---

## 📂 Project Structure

```text
leave-management-system/
│
├── lambda/
│   ├── business_logic.py
│   ├── handlers.py
│   ├── validators.py
│   ├── utils.py
│
├── infrastructure/
├── tests/
├── README.md
└── requirements.txt
```

---

## 💡 Skills Demonstrated

* Serverless Architecture
* Backend Development
* REST API Design
* Business Logic Implementation
* AWS Cloud Computing
* DynamoDB Integration
* Data Validation
* Clean Code Organization
* Git Version Control

---

## 🚀 Future Enhancements

* JWT Authentication
* Role-Based Access Control (RBAC)
* Email Notifications using Amazon SES
* HR Dashboard
* Leave Calendar
* Reporting and Analytics
* Team Leave Conflict Detection
* Audit Logging
* CI/CD Pipeline using GitHub Actions
