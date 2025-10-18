# Release Checklist

This checklist ensures consistent, high-quality releases.

## Pre-Release (Development)

### Code Quality
- [ ] All tests passing locally (`npm run ci`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Test coverage meets thresholds (>80%)
- [ ] All new features have tests
- [ ] Documentation updated for new features

### Code Review
- [ ] All PRs reviewed and approved
- [ ] No unresolved review comments
- [ ] All CI checks passing on main branch
- [ ] Security scan (CodeQL) passed
- [ ] Dependabot alerts addressed

### Database
- [ ] Prisma migrations generated and tested
- [ ] Migration rollback plan documented
- [ ] Database backup created (production)

## Staging Deploy

### Pre-Deploy
- [ ] Staging environment secrets updated
- [ ] Environment variables verified
- [ ] Database migration plan reviewed

### Deploy
- [ ] Deploy to staging environment
- [ ] Run database migrations (staging)
- [ ] Verify deployment successful

### Testing
- [ ] Smoke tests pass (key user flows)
- [ ] Authentication flows working
- [ ] Map functionality working
- [ ] Email notifications sending
- [ ] API endpoints responding correctly
- [ ] No console errors in browser
- [ ] Mobile responsiveness verified

### Performance
- [ ] Page load times acceptable (<3s)
- [ ] Lighthouse score >90
- [ ] No memory leaks detected
- [ ] Database query performance acceptable

## Production Deploy

### Pre-Deploy
- [ ] Create release notes
- [ ] Tag release in git (`git tag v1.x.x`)
- [ ] Production secrets verified
- [ ] Backup plan ready
- [ ] Rollback plan documented
- [ ] Team notified of deploy window

### Deploy
- [ ] Deploy to production (Vercel)
- [ ] Run database migrations (production)
- [ ] Verify deployment successful
- [ ] Check deployment logs for errors

### Post-Deploy Verification
- [ ] Run smoke tests on production
- [ ] Verify authentication working
- [ ] Test critical user flows
- [ ] Check error tracking (Sentry)
- [ ] Monitor application logs (15 min)
- [ ] Verify database connections healthy
- [ ] Check API response times

### Monitoring (First 2 Hours)
- [ ] Monitor error rates
- [ ] Check CPU/memory usage
- [ ] Watch database performance
- [ ] Monitor user reports/feedback
- [ ] Check uptime monitors

### Communication
- [ ] Update status page (if incidents)
- [ ] Post release notes to changelog
- [ ] Notify team of successful deploy
- [ ] Share release notes with stakeholders

## Post-Release

### Documentation
- [ ] Update version in package.json
- [ ] Publish release notes on GitHub
- [ ] Update CHANGELOG.md
- [ ] Document any manual steps taken

### Cleanup
- [ ] Close completed issues
- [ ] Archive completed project boards
- [ ] Delete old feature branches
- [ ] Update roadmap

### Review
- [ ] Review deployment metrics
- [ ] Document lessons learned
- [ ] Update this checklist if needed
- [ ] Schedule retrospective (if needed)

## Rollback Procedure

If issues are detected:

1. **Immediate**: Revert to previous Vercel deployment
   ```bash
   vercel rollback
   ```

2. **Database**: Run rollback migrations if needed
   ```bash
   npx prisma migrate rollback
   ```

3. **Communication**: Notify team and users of rollback

4. **Investigation**: Create incident report and root cause analysis

## Emergency Contacts

- **On-Call Engineer**: [Contact Info]
- **Database Admin**: [Contact Info]
- **Team Lead**: [Contact Info]

## Sign-Off

- [ ] Release Manager: _______________  Date: _______
- [ ] Tech Lead: _______________  Date: _______
- [ ] Product Owner: _______________  Date: _______

---

**Version**: 1.0  
**Last Updated**: 2025-10-18
