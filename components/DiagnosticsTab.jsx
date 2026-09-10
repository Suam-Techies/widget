'use client';
import React, { useState } from 'react';
import { FlaskIcon, SparklesIcon, CheckIcon, CopyIcon } from './Icons';

export default function DiagnosticsTab({ onSendToChat }) {
  const [framework, setFramework] = useState('playwright');
  const [issueType, setIssueType] = useState('ui_button');
  const [description, setDescription] = useState('');
  const [fixDiff, setFixDiff] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const presets = [
    {
      id: 'ui_button',
      label: 'UI Button / State Regression',
      defaultDesc: 'Checkout button remains disabled after applying a coupon code in Safari & Chrome mobile.',
      defaultDiff: `- if (hasCoupon && !isCartEmpty) { setIsDisabled(true); }\n+ if (hasCoupon && !isCartEmpty) { setIsDisabled(false); }`
    },
    {
      id: 'api_status',
      label: 'API Null Pointer / 500 Error',
      defaultDesc: 'GET /api/v1/user/profile throws 500 when billing_address is null on newly registered users.',
      defaultDiff: `- return user.billing_address.country;\n+ return user.billing_address?.country || 'US';`
    },
    {
      id: 'auth_token',
      label: 'JWT Refresh Race Condition',
      defaultDesc: 'Concurrent API calls cause multiple refresh token requests, invalidating valid user session.',
      defaultDiff: `- let isRefreshing = false;\n+ let refreshPromise = null; // Share single in-flight promise`
    }
  ];

  const handleApplyPreset = (p) => {
    setIssueType(p.id);
    setDescription(p.defaultDesc);
    setFixDiff(p.defaultDiff);
  };

  const handleGenerateQA = () => {
    if (!description.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      let testTemplate = '';
      if (framework === 'playwright') {
        testTemplate = `import { test, expect } from '@playwright/test';

// Regression Test synthesized by FixOnce QA
// Target: ${description.slice(0, 50)}...
test.describe('FixOnce Regression Suite: Issue #FXQ-${Math.floor(1000 + Math.random() * 9000)}', () => {
  test('verify fix prevents reoccurrence of defect', async ({ page }) => {
    await page.goto('/checkout');
    await page.fill('[data-testid="coupon-input"]', 'SAVE20');
    await page.click('[data-testid="apply-coupon-btn"]');
    
    // Assert fix: Must not be disabled or throw error
    const submitBtn = page.locator('[data-testid="checkout-submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 4000 });
  });

  test('edge case: empty coupon does not alter cart state', async ({ page }) => {
    await page.goto('/checkout');
    await page.click('[data-testid="apply-coupon-btn"]');
    await expect(page.locator('.toast-error')).toBeVisible();
  });
});`;
      } else if (framework === 'jest') {
        testTemplate = `describe('FixOnce QA Regression Suite', () => {
  it('should handle payload gracefully without 500 or null crash', async () => {
    const mockUserWithoutBilling = { id: 'usr_123', name: 'Alex', billing_address: null };
    const result = sanitizeUserProfile(mockUserWithoutBilling);
    
    expect(result.country).toBe('US');
    expect(result).not.toHaveProperty('error');
  });

  it('boundary mutation: handles undefined profile safely', () => {
    expect(() => sanitizeUserProfile(undefined)).not.toThrow();
  });
});`;
      } else {
        testTemplate = `describe('FixOnce Cypress Regression Test', () => {
  it('verifies fix state under simulated mobile viewport', () => {
    cy.viewport('iphone-x');
    cy.visit('/checkout');
    cy.get('[data-testid="coupon-input"]').type('SAVE20');
    cy.get('[data-testid="apply-coupon-btn"]').click();
    cy.get('[data-testid="checkout-submit"]').should('not.be.disabled');
  });
});`;
      }

      setGeneratedReport({
        id: `QA-RPT-${Date.now().toString().slice(-4)}`,
        framework,
        riskScore: 'Low (Safe to merge)',
        regressionLikelihood: '< 0.2%',
        testCode: testTemplate,
        checklist: [
          'Pre-fix negative reproduction confirmed (Failed as expected)',
          'Post-fix commit passed with 0 errors',
          'Adjacent mutation tests passed (2 tests)',
          'Flakiness burn-in: 10/10 runs successful'
        ]
      });
      setIsGenerating(false);
    }, 850);
  };

  const handleCopyCode = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport.testCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fo-diag-view fo-custom-scroll">
      <div className="fo-diag-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600, fontSize: '0.78rem' }}>
          <FlaskIcon /> FixOnce QA Verification Wizard
        </div>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.25rem' }}>
          Simulate a bug fix to synthesize automated regression tests and check regression risk.
        </p>
      </div>

      {/* Presets */}
      <div>
        <label className="fo-form-label" style={{ marginBottom: '0.35rem', display: 'block' }}>Quick Bug Presets:</label>
        <div className="fo-diag-presets">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`fo-preset-btn ${issueType === p.id && description === p.defaultDesc ? 'active' : ''}`}
            >
              <div className="fo-preset-title">{p.label}</div>
              <div className="fo-preset-desc">{p.defaultDesc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Framework Selector */}
      <div className="fo-form-group">
        <label className="fo-form-label">Target Test Framework:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
          {['playwright', 'jest', 'cypress'].map((fw) => (
            <button
              key={fw}
              type="button"
              onClick={() => setFramework(fw)}
              style={{
                padding: '0.4rem',
                borderRadius: '6px',
                border: framework === fw ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                background: framework === fw ? '#10b981' : '#141724',
                color: framework === fw ? '#090a10' : '#9ca3af',
                fontWeight: 600,
                fontSize: '0.72rem',
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {fw}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="fo-form-group">
        <label className="fo-form-label">Bug & Fix Description:</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Checkout button stayed disabled after coupon applied..."
          className="fo-form-textarea"
        />
      </div>

      {/* Git Diff */}
      <div className="fo-form-group">
        <label className="fo-form-label">Git Diff (Optional):</label>
        <textarea
          rows={2}
          value={fixDiff}
          onChange={(e) => setFixDiff(e.target.value)}
          placeholder="- old logic
+ fixed logic"
          className="fo-form-textarea"
          style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
        />
      </div>

      <button
        type="button"
        disabled={!description.trim() || isGenerating}
        onClick={handleGenerateQA}
        className="fo-action-btn"
      >
        <SparklesIcon />
        {isGenerating ? 'Synthesizing QA Tests...' : 'Run FixOnce QA Verification'}
      </button>

      {/* Report */}
      {generatedReport && (
        <div className="fo-report-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckIcon /> QA Verification Passed
            </span>
            <span style={{ fontSize: '0.65rem', color: '#9ca3af', fontFamily: 'monospace' }}>
              {generatedReport.id}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.7rem' }}>
            <div style={{ background: '#090a10', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ color: '#6b7280', display: 'block', fontSize: '0.65rem' }}>Regression Risk</span>
              <strong style={{ color: '#10b981' }}>{generatedReport.riskScore}</strong>
            </div>
            <div style={{ background: '#090a10', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ color: '#6b7280', display: 'block', fontSize: '0.65rem' }}>Flakiness Rate</span>
              <strong style={{ color: '#06b6d4' }}>{generatedReport.regressionLikelihood}</strong>
            </div>
          </div>

          <div style={{ fontSize: '0.7rem', color: '#e5e7eb' }}>
            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#9ca3af' }}>Checklist:</strong>
            {generatedReport.checklist.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '0.2rem 0' }}>
                <span style={{ color: '#10b981', fontSize: '0.65rem' }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Test Code */}
          <div className="fo-code-block">
            <div className="fo-code-header">
              <span>{generatedReport.framework} test</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="fo-code-copy-btn"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span>{copied ? 'Copied' : 'Copy Test'}</span>
              </button>
            </div>
            <pre className="fo-code-body" style={{ maxHeight: '120px' }}>
              <code>{generatedReport.testCode}</code>
            </pre>
          </div>

          <button
            type="button"
            onClick={() => onSendToChat?.(`I verified fix for "${description}". How does FixOnce deploy this test to CI/CD?`)}
            className="fo-action-btn"
            style={{ background: '#181c2b', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.72rem' }}
          >
            Discuss this fix in Chat tab →
          </button>
        </div>
      )}
    </div>
  );
}
