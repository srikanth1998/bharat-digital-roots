import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  fullName?: string
  memberCode?: string
  email?: string
  tempPassword?: string
  planName?: string
  amountInr?: number
  razorpayPaymentId?: string
  razorpayOrderId?: string
  expiresAt?: string
  loginUrl?: string
}

const Email = ({
  fullName = 'Member',
  memberCode = 'FFM-X-0000-0000',
  email = 'member@example.com',
  tempPassword = 'temporary',
  planName = 'Active Membership',
  amountInr = 0,
  razorpayPaymentId = '',
  razorpayOrderId = '',
  expiresAt = '',
  loginUrl = 'https://example.com/login',
}: Props) => {
  const validTill = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Lifetime'
  const isLifetime = !expiresAt

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        Welcome to Feathers Forum — your Member ID {memberCode}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={kicker}>FEATHERS FORUM</Text>
          <Heading style={h1}>Welcome, {fullName}.</Heading>
          <Text style={lead}>
            Your membership registration has been approved and is now active
            {isLifetime ? ' for a lifetime' : ' for one year'}.
            Below is your digital Member ID card — keep this email safe.
          </Text>

          {/* ID Card */}
          <Section style={card}>
            <Text style={cardKicker}>MEMBER ID CARD</Text>
            <Heading as="h2" style={cardName}>
              {fullName}
            </Heading>
            <Text style={cardPlan}>{planName}</Text>
            <Hr style={cardDivider} />
            <Row>
              <Column style={cardColLeft}>
                <Text style={cardLabel}>Member ID</Text>
                <Text style={cardValueMono}>{memberCode}</Text>
              </Column>
              <Column style={cardColRight}>
                <Text style={cardLabel}>Valid till</Text>
                <Text style={cardValue}>{validTill || '1 year from today'}</Text>
              </Column>
            </Row>
          </Section>

          {/* Membership details */}
          <Heading as="h3" style={h3}>Membership details</Heading>
          <Section style={kv}>
            <KV label="Plan" value={planName} />
            <KV label="Member ID" value={memberCode} mono />
            <KV label="Valid till" value={validTill} />
          </Section>

          {/* Login credentials */}
          <Heading as="h3" style={h3}>Your login details</Heading>
          <Text style={p}>
            Sign in with the credentials below. You'll be asked to set your own
            password the first time you log in.
          </Text>
          <Section style={kv}>
            <KV label="Email" value={email} mono />
            <KV label="Temporary password" value={tempPassword} mono />
          </Section>

          <Section style={ctaWrap}>
            <a href={loginUrl} style={ctaBtn}>Go to login →</a>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            If you didn't make this payment, please reply to this email
            immediately. Thank you for joining the movement.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

function KV({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <Row style={kvRow}>
      <Column style={kvLabelCol}>
        <Text style={kvLabel}>{label}</Text>
      </Column>
      <Column style={kvValueCol}>
        <Text style={mono ? kvValueMono : kvValue}>{value || '—'}</Text>
      </Column>
    </Row>
  )
}

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Welcome to Vanya — Member ID ${data?.memberCode ?? ''}`.trim(),
  displayName: 'Membership welcome & ID card',
  previewData: {
    fullName: 'Anand Kumar',
    memberCode: 'FFM-A-2026-0001',
    email: 'anand@example.com',
    tempPassword: 'a1b2c3d4e5',
    planName: 'Active Membership (1 Year)',
    amountInr: 500,
    razorpayPaymentId: 'pay_TESTabcdef',
    razorpayOrderId: 'order_TESTabcdef',
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    loginUrl: 'https://bharat-digital-roots.lovable.app/login',
  },
} satisfies TemplateEntry

// ---- styles ----
const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', color: '#1a1a1a' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const kicker = { fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.2em', color: '#c0892f', fontWeight: 600 as const, margin: '0 0 12px' }
const h1 = { fontSize: '32px', lineHeight: '1.15', fontWeight: 500 as const, margin: '0 0 16px', color: '#0a6b3b' }
const h3 = { fontFamily: 'Arial, sans-serif', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#1a1a1a', fontWeight: 700 as const, margin: '28px 0 8px' }
const lead = { fontSize: '15px', lineHeight: '1.6', color: '#444', margin: '0 0 24px' }
const p = { fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.6', color: '#444', margin: '0 0 12px' }

const card = { backgroundColor: '#0a6b3b', borderRadius: '16px', padding: '24px', color: '#fdfbf5', margin: '0 0 24px' }
const cardKicker = { fontFamily: 'Arial, sans-serif', fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(253,251,245,0.7)', fontWeight: 600 as const, margin: '0 0 8px' }
const cardName = { fontSize: '24px', fontWeight: 500 as const, color: '#fdfbf5', margin: '0' }
const cardPlan = { fontFamily: 'Arial, sans-serif', fontSize: '13px', color: 'rgba(253,251,245,0.85)', margin: '4px 0 0' }
const cardDivider = { borderColor: 'rgba(253,251,245,0.25)', margin: '16px 0' }
const cardColLeft = { width: '60%' as const, verticalAlign: 'top' as const }
const cardColRight = { width: '40%' as const, verticalAlign: 'top' as const, textAlign: 'right' as const }
const cardLabel = { fontFamily: 'Arial, sans-serif', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(253,251,245,0.7)', margin: '0 0 4px' }
const cardValueMono = { fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '16px', fontWeight: 600 as const, color: '#fdfbf5', margin: 0, letterSpacing: '0.05em' }
const cardValue = { fontFamily: 'Arial, sans-serif', fontSize: '15px', fontWeight: 600 as const, color: '#fdfbf5', margin: 0 }

const kv = { backgroundColor: '#faf7f0', borderRadius: '12px', padding: '8px 16px', margin: '0 0 8px' }
const kvRow = { borderBottom: '1px solid #eee' }
const kvLabelCol = { width: '42%' as const, verticalAlign: 'top' as const, padding: '10px 8px 10px 0' }
const kvValueCol = { width: '58%' as const, verticalAlign: 'top' as const, padding: '10px 0' }
const kvLabel = { fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#888', margin: 0 }
const kvValue = { fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#1a1a1a', margin: 0 }
const kvValueMono = { fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '13px', color: '#1a1a1a', margin: 0, wordBreak: 'break-all' as const }

const ctaWrap = { textAlign: 'center' as const, margin: '24px 0 8px' }
const ctaBtn = { display: 'inline-block', backgroundColor: '#0a6b3b', color: '#fdfbf5', textDecoration: 'none', padding: '12px 28px', borderRadius: '999px', fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 600 as const }
const hr = { borderColor: '#eee', margin: '32px 0 16px' }
const footer = { fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#888', lineHeight: '1.6', margin: 0 }
