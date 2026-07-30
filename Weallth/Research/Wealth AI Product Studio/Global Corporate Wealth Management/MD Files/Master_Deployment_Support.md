# Global Corporate Wealth Management Platform
## Master Production Deployment & Support Document

---

## 1. PRODUCTION DEPLOYMENT STRATEGY

### 1.1 Deployment Phases

#### Phase 1: Pre-Deployment (Days 1-5)

**1.1.1 Infrastructure Readiness**
```
[ ] AWS infrastructure provisioned and tested
    ├─ VPC configured with multi-AZ setup
    ├─ RDS PostgreSQL primary and standby
    ├─ Redis cluster with 6 nodes
    ├─ MongoDB replica set with 3 nodes
    ├─ Elasticsearch cluster with 8 nodes
    ├─ Load balancers configured
    ├─ CDN configured (CloudFront)
    ├─ DDoS protection enabled (AWS Shield)
    └─ Monitoring and logging configured

[ ] Secondary regions ready (Azure, GCP)
[ ] VPN and network connectivity tested
[ ] Security groups and firewall rules in place
[ ] SSL/TLS certificates installed and validated
[ ] DNS records prepared (not yet activated)
```

**1.1.2 Application Readiness**
```
[ ] All services packaged in Docker containers
[ ] Container images uploaded to ECR
[ ] Kubernetes manifests prepared
[ ] Helm charts created for all services
[ ] Configuration files prepared for production
[ ] Secrets stored in AWS Secrets Manager
[ ] Database migrations tested and validated
[ ] Backup and recovery procedures tested
```

**1.1.3 Data Migration Planning**
```
[ ] Source data systems identified
[ ] Data mapping specifications finalized
[ ] ETL jobs tested
[ ] Data validation procedures prepared
[ ] Reconciliation procedures prepared
[ ] Data backup before migration
[ ] Rollback procedures tested
[ ] Timeline and cutover plan finalized
```

#### Phase 2: Production Rollout (Day 6-10)

**2.1 Canary Deployment** (5% of traffic)

**Day 1**:
- Deploy Investment Management module to 5% of traffic
- Monitor error rates, latency, CPU, memory
- Run synthetic smoke tests every minute
- Alert thresholds:
  - Error rate > 1%
  - Latency p95 > 500ms
  - CPU > 80%
  - Memory > 85%

```
Canary Metrics to Monitor:
├─ Request success rate (target: > 99%)
├─ Error types and distribution
├─ Latency (p50, p95, p99)
├─ Database connection pool utilization
├─ Cache hit rate
├─ API gateway throughput
└─ Business metrics (trades executed, portfolios updated)
```

**Canary Decision Criteria**:
- If all metrics green: Increase to 25% traffic
- If warnings: Hold and investigate
- If critical errors: Rollback to previous version

**Day 2-3**:
- Gradually increase traffic: 25% → 50% → 75% → 100%
- Monitor at each stage for 4+ hours
- Prepare to rollback if issues detected

**Day 4-7**:
- Deploy Portfolio Management module (repeat canary process)
- Deploy Retirement Planning module
- Deploy other modules in priority order

#### Phase 3: Stabilization (Days 11-30)

**3.1 Post-Deployment Monitoring**
```
Continuous Monitoring Dashboard:
├─ Application Performance
│   ├─ API response times
│   ├─ Error rates by endpoint
│   ├─ Database query performance
│   └─ Cache performance
├─ Infrastructure
│   ├─ CPU utilization by service
│   ├─ Memory utilization
│   ├─ Disk I/O and storage
│   └─ Network bandwidth
├─ Business Metrics
│   ├─ Trades executed daily
│   ├─ Portfolios updated
│   ├─ Reports generated
│   └─ Active users
└─ Compliance Metrics
    ├─ Audit logs generated
    ├─ Reconciliation success rate
    └─ Best execution documentation
```

**3.2 Optimization Phase**
- Analyze resource utilization
- Right-size database instances
- Optimize cache hit rates
- Identify and fix performance bottlenecks
- Implement auto-scaling policies

### 1.2 Deployment Procedure

#### Step 1: Pre-Deployment Checks
```bash
# Validate environment configuration
./scripts/validate-config.sh production

# Run pre-deployment smoke tests
./scripts/run-smoke-tests.sh staging

# Verify database backup
./scripts/backup-database.sh production

# Check capacity
./scripts/check-capacity.sh production
```

#### Step 2: Database Migration
```bash
# Review pending migrations
./scripts/list-migrations.sh

# Run migrations in staging environment
./scripts/run-migrations.sh staging

# Verify migrations
./scripts/verify-migrations.sh staging

# Run migrations in production with backup
./scripts/backup-database.sh production
./scripts/run-migrations.sh production --backup-before

# Verify production migrations
./scripts/verify-migrations.sh production
```

#### Step 3: Service Deployment
```bash
# Build and push Docker images
docker build -t investment-service:${VERSION} ./services/investment/
docker tag investment-service:${VERSION} \
  123456789.dkr.ecr.us-east-1.amazonaws.com/investment-service:${VERSION}
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/investment-service:${VERSION}

# Update Kubernetes deployment with canary strategy
kubectl set image deployment/investment-service \
  investment-service=123456789.dkr.ecr.us-east-1.amazonaws.com/investment-service:${VERSION} \
  --record --all-namespaces

# Monitor rollout
kubectl rollout status deployment/investment-service --timeout=5m

# Check pod status
kubectl get pods -l app=investment-service
```

#### Step 4: Health Checks
```bash
# Run synthetic user tests
./scripts/run-synthetic-tests.sh production

# Check key endpoints
curl -H "Authorization: Bearer ${TEST_TOKEN}" \
  https://api.platform.wealth.io/api/v1/health

# Verify database connectivity
./scripts/test-db-connectivity.sh production

# Test backup and restore
./scripts/test-backup-restore.sh production
```

#### Step 5: Rollout Traffic
```
Time    Traffic    Actions
────────────────────────────────────
T+0     5%        Monitor 30 minutes
T+30    5%        All metrics green?
T+60    25%       Gradual increase
T+2h    50%       Monitor 60 minutes
T+3h    75%       Continue monitoring
T+4h    100%      Full traffic routing
```

#### Step 6: Post-Deployment Verification
```bash
# Run full test suite
./scripts/run-full-tests.sh production

# Verify SLA compliance
./scripts/check-slas.sh production

# Generate deployment report
./scripts/generate-deployment-report.sh production

# Notify stakeholders
./scripts/send-notification.sh "Deployment complete"
```

### 1.3 Rollback Procedures

**Automatic Rollback Triggers**:
- Error rate > 5% (60-second window)
- Latency p95 > 2000ms (60-second window)
- CPU usage > 95% (sustained 5 minutes)
- Database connection failures > 10% (60-second window)
- Critical alerts from monitoring system

**Manual Rollback Decision**:
- On-call engineer observes concerning metrics
- Escalates to deployment lead
- Deployment lead reviews logs and metrics
- Decision to rollback made and executed

**Rollback Execution**:
```bash
# Trigger rollback
./scripts/rollback-deployment.sh production --version=${PREVIOUS_VERSION}

# Verify rollback
kubectl rollout status deployment/investment-service --timeout=5m

# Verify services are healthy
./scripts/verify-services.sh production

# Run smoke tests
./scripts/run-smoke-tests.sh production

# Communicate status
./scripts/send-notification.sh "Rollback completed"
```

---

## 2. PRODUCTION SUPPORT & OPERATIONS

### 2.1 On-Call Support Structure

#### 2.1.1 On-Call Schedule
```
Primary On-Call (Business Hours: Mon-Fri 9-5):
  - Senior Engineer (rotation: weekly)
  - Responsibilities: Emergency issues, escalations

Secondary On-Call (After Hours, Weekends):
  - Senior Engineer (rotation: weekly)
  - Responsibilities: Critical production issues only

On-Call Manager:
  - Director-level (rotation: weekly)
  - Responsibilities: Escalations, customer communication
```

#### 2.1.2 Incident Severity Levels

```
SEVERITY 1 (CRITICAL): Production is down or severely degraded
├─ Example: All customers unable to access portfolios
├─ Response time: 5 minutes
├─ On-call escalation: Immediate
└─ Update frequency: Every 15 minutes

SEVERITY 2 (HIGH): Major functionality impaired for some users
├─ Example: Trading execution delayed for 1,000+ users
├─ Response time: 30 minutes
├─ On-call escalation: Within 5 minutes
└─ Update frequency: Every 30 minutes

SEVERITY 3 (MEDIUM): Moderate functionality issue
├─ Example: Performance degradation (p95 > 1000ms)
├─ Response time: 2 hours
├─ On-call escalation: By next business day
└─ Update frequency: Every 2 hours

SEVERITY 4 (LOW): Minor issue, workaround available
├─ Example: UI display issue in report generation
├─ Response time: 24 hours
├─ On-call escalation: None
└─ Update frequency: Daily
```

### 2.2 Monitoring & Alerting

#### 2.2.1 Key Performance Indicators (KPIs)

```
System Health KPIs:
├─ Platform Availability: Target 99.95%
├─ API Response Time (p95): Target < 500ms
├─ Error Rate: Target < 0.1%
├─ Data Sync Latency: Target < 4 hours
└─ Report Generation Time: Target < 30 seconds

Business KPIs:
├─ Trades Executed Daily: Target > 1,000
├─ Portfolio Updates: Target > 500/hour
├─ Advisor Engagement: Target > 60% weekly active
├─ Customer Satisfaction (NPS): Target > 60
└─ Compliance Violations: Target = 0
```

#### 2.2.2 Alert Configuration

**Critical Alerts** (Page on-call):
```
IF error_rate > 5% FOR 5 minutes THEN
  ALERT "CRITICAL: High error rate"
  NOTIFY pagerduty_critical_channel

IF latency_p95 > 2000ms FOR 10 minutes THEN
  ALERT "CRITICAL: High latency"
  NOTIFY pagerduty_critical_channel

IF database_connections_available < 10 THEN
  ALERT "CRITICAL: DB connection pool exhausted"
  NOTIFY pagerduty_critical_channel

IF service_restart_count > 3 IN 1_HOUR THEN
  ALERT "CRITICAL: Service restarting frequently"
  NOTIFY pagerduty_critical_channel
```

**Warning Alerts** (Log & escalate):
```
IF error_rate > 1% FOR 10 minutes THEN
  ALERT "WARNING: Error rate elevated"
  LOG to Slack #alerts channel

IF latency_p95 > 800ms FOR 15 minutes THEN
  ALERT "WARNING: Latency increased"
  LOG to Slack #alerts channel

IF cpu_utilization > 80% FOR 20 minutes THEN
  ALERT "WARNING: High CPU usage"
  LOG to Slack #alerts channel

IF disk_usage > 80% THEN
  ALERT "WARNING: Disk usage high"
  LOG to Slack #alerts channel
```

### 2.3 Incident Response Procedures

#### 2.3.1 Incident Response Workflow

```
INCIDENT DETECTED
  ↓
Severity Assessment (5 min)
  ├─ CRITICAL → Page on-call immediately
  ├─ HIGH → Alert on-call (may take 15-30 min)
  └─ MEDIUM/LOW → Log and track for business hours
  ↓
Incident Response Team Assembly
  ├─ On-call engineer takes lead
  ├─ Subject matter expert(s) join
  ├─ Manager joins (if CRITICAL/HIGH)
  └─ Communications lead updates stakeholders
  ↓
Investigate & Mitigate
  ├─ Check monitoring dashboards
  ├─ Review application logs
  ├─ Review deployment history
  ├─ Contact affected customers (if needed)
  ├─ Implement workaround if available
  └─ Begin root cause analysis
  ↓
Resolve or Escalate
  ├─ If fixable: Deploy fix with canary approach
  ├─ If not: Escalate to engineering leadership
  └─ Continue monitoring for resolution
  ↓
POST-INCIDENT
  ├─ Document resolution steps
  ├─ Schedule post-mortem within 24 hours
  ├─ Identify preventive actions
  ├─ Update runbooks
  └─ Close incident ticket
```

#### 2.3.2 Sample Incident Runbook: Portfolio Data Sync Failure

**Symptom**: Portfolio holdings not updating for past 4+ hours

**Initial Response**:
1. Check ETL pipeline status: `kubectl logs -l app=etl-pipeline -f`
2. Verify database connectivity: `./scripts/test-db-connectivity.sh prod`
3. Check custodian API status: Contact custodian NOC
4. Review monitoring dashboard for errors
5. Alert customers if necessary

**Common Causes & Fixes**:
| Cause | Check | Fix |
|-------|-------|-----|
| ETL job hung | ps aux \| grep etl | Kill job: kubectl delete pod -l app=etl |
| DB connection exhausted | SELECT count(*) FROM pg_stat_activity | Restart service |
| Custodian API down | curl https://api.schwab.com/status | Wait for API recovery |
| Memory leak | kubectl top pods -l app=etl | Restart container |

**Escalation**:
- If not resolved in 30 minutes: Page senior engineer
- If not resolved in 1 hour: Notify management
- If not resolved in 2 hours: Prepare customer communication

**Resolution Verification**:
```bash
# Verify sync is running
kubectl logs -l app=etl-pipeline --tail=50

# Check for recent updates
SELECT COUNT(*) FROM holdings WHERE updated_at > NOW() - INTERVAL '5 minutes';

# Verify no data gaps
SELECT date, COUNT(*) FROM holdings GROUP BY date ORDER BY date DESC LIMIT 10;

# Confirm customer dashboards updating
curl -H "Authorization: Bearer ${TOKEN}" \
  https://api.platform.wealth.io/api/v1/portfolios/test-client/holdings
```

### 2.4 Backup & Disaster Recovery

#### 2.4.1 Backup Strategy

**Database Backups**:
```
Backup Type        Frequency    Retention    Location
──────────────────────────────────────────────────────
Continuous WAL     Every 1 min   7 days       S3
Snapshot           Every 1h      30 days      S3
Daily Snapshot     Daily         1 year       S3 + Glacier
Monthly Archive    Monthly       7 years      Glacier
```

**Backup Verification**:
```bash
# Test daily backup restoration (weekly)
./scripts/test-restore-daily-backup.sh production

# Test monthly backup restoration (monthly)
./scripts/test-restore-monthly-backup.sh production

# Verify backup integrity
./scripts/verify-backup-integrity.sh production
```

#### 2.4.2 Disaster Recovery

**RTO/RPO Targets**:
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour

**DR Failover Procedure**:
```
DECISION TO FAILOVER MADE (Primary region unreachable)
  ↓
Verify primary is truly down (not false alarm)
  ├─ Ping all primary services
  ├─ Check AWS status page
  ├─ Contact AWS support
  └─ Confirm with multiple team members
  ↓
Activate secondary region
  ├─ Restore from latest backup
  ├─ Update DNS to point to secondary
  ├─ Verify all services operational
  ├─ Run smoke tests
  └─ Notify customers
  ↓
Restore full functionality
  ├─ Replay transaction log to latest point
  ├─ Reconcile data between systems
  ├─ Clear stale caches
  └─ Run full test suite
  ↓
Failure analysis & restoration
  ├─ Determine root cause of primary failure
  ├─ Implement fix in primary region
  ├─ Failback to primary (if possible)
  └─ Return to normal operations
```

### 2.5 Performance Monitoring & Optimization

#### 2.5.1 Continuous Performance Monitoring

**Synthetic Transaction Monitoring**:
```
Test every 5 minutes:
├─ GET /portfolios/test-client-1 (should complete in < 200ms)
├─ POST /portfolios/test-client-1/trades (should complete in < 300ms)
├─ GET /reports/performance/test-client-1 (should complete in < 5000ms)
└─ POST /analysis/retirement/test-client-1 (should complete in < 3000ms)

Alert if:
├─ Latency > 2x baseline
├─ Any request fails
├─ Success rate < 99%
└─ Consecutive failures > 3
```

**Real User Monitoring**:
```
Collect from browser:
├─ Page load time
├─ Time to interactive
├─ JavaScript errors
├─ Network requests
├─ User interactions

Report on:
├─ Core Web Vitals (LCP, FID, CLS)
├─ Custom business metrics
├─ Geographic performance
└─ Device performance
```

#### 2.5.2 Optimization Initiatives

**Quarterly Performance Reviews**:
1. Analyze trends in response times
2. Identify slow endpoints
3. Review database query plans
4. Check cache hit rates
5. Evaluate resource utilization
6. Implement optimizations
7. Verify improvements

**Example Optimization**:
```
Problem: GET /holdings taking 800ms (p95)
Analysis: N+1 query issue in holdings retrieval
Solution: Implement batch loading + eager fetch
Result: Reduced to 150ms p95 (5.3x improvement)
```

---

## 3. PRODUCTION SUPPORT RUNBOOKS

### 3.1 Common Issues & Resolution

#### Issue: High CPU Usage

**Diagnosis**:
```bash
# Identify high CPU service
kubectl top nodes
kubectl top pods --sort-by=cpu

# Check service metrics
kubectl describe pod <pod-name>
```

**Resolution**:
1. Check for runaway processes: `ps aux | head -20`
2. Review recent deployments
3. Scale up service if under load: `kubectl scale deployment <name> --replicas=5`
4. If persistent: Restart service `kubectl rollout restart deployment <name>`

#### Issue: Database Connection Exhaustion

**Diagnosis**:
```sql
SELECT count(*) FROM pg_stat_activity;
SELECT usename, count(*) FROM pg_stat_activity GROUP BY usename;
```

**Resolution**:
1. Identify connection hogs
2. Kill idle connections: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';`
3. Restart services to reset connection pools
4. Review connection pool settings

#### Issue: Memory Leak

**Diagnosis**:
```bash
kubectl top pods -l app=<service> --sort-by=memory
# Watch memory growth over time
watch -n 5 'kubectl top pod <pod-name>'
```

**Resolution**:
1. Check logs for warnings: `kubectl logs <pod-name> | grep -i memory`
2. Restart pod: `kubectl delete pod <pod-name>`
3. If recurring: Escalate to engineering for code review
4. Monitor heap dumps if available

---

## 4. COMPLIANCE & AUDIT

### 4.1 Audit Logging

**All actions logged**:
- User login/logout
- Data access
- Configuration changes
- Trade execution
- Report generation
- System errors

**Retention**: 7 years minimum

**Immutability**: Audit logs cannot be modified after creation

### 4.2 Compliance Monitoring

**Daily Checks**:
- [ ] No failed backup in last 24 hours
- [ ] No data validation errors in ETL
- [ ] All regulatory reports generated
- [ ] No security alerts
- [ ] All services healthy

---

## Document Metadata

**Document Version**: 1.0
**Last Updated**: January 24, 2026
**Classification**: Internal - Confidential
**Audience**: DevOps Team, On-Call Engineers, Operations Team