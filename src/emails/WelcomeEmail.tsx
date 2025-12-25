import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface WelcomeEmailProps {
    readonly name: string;
    readonly dashboardUrl: string;
}

export default function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Welcome to Courier Connect - Let's get started!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={logo}>Courier Connect</Heading>
                        <Text style={tagline}>Prague's courier network. 70% to you.</Text>
                    </Section>

                    <Section style={content}>
                        <Heading style={h1}>🎉 You're verified, {name}!</Heading>

                        <Text style={text}>
                            Your email is now verified, and you're officially part of the Courier Connect
                            community. Here's what you can do now:
                        </Text>

                        <Section style={feature}>
                            <Text style={featureTitle}>📍 Explore the Map</Text>
                            <Text style={featureText}>
                                See people fighting similar battles in your area. Find allies for insurance
                                disputes, housing collaborations, or other challenges.
                            </Text>
                        </Section>

                        <Section style={feature}>
                            <Text style={featureTitle}>👤 Complete Your Profile</Text>
                            <Text style={featureText}>
                                Add your skills, interests, and what you're working on. The more complete
                                your profile, the easier it is to connect with the right people.
                            </Text>
                        </Section>

                        <Section style={feature}>
                            <Text style={featureTitle}>🤝 Start Collaborating</Text>
                            <Text style={featureText}>
                                Create or join collaborations. Whether it's fighting an insurance denial or
                                buying a home together, we're stronger as a team.
                            </Text>
                        </Section>

                        <Button style={button} href={dashboardUrl}>
                            Go to Dashboard
                        </Button>

                        <Section style={verification}>
                            <Heading style={h2}>Build Your Trust Score</Heading>
                            <Text style={text}>
                                You've completed email verification (✓). Consider adding:
                            </Text>
                            <Text style={verificationItem}>📱 Phone verification - adds credibility</Text>
                            <Text style={verificationItem}>🪪 ID verification - builds maximum trust</Text>
                            <Text style={textSmall}>
                                Higher verification = more collaboration opportunities
                            </Text>
                        </Section>
                    </Section>

                    <Section style={footer}>
                        <Text style={textSmall}>
                            <strong>Need help getting started?</strong> Visit our{' '}
                            <Link href={`${dashboardUrl}/docs`} style={link}>
                                documentation
                            </Link>{' '}
                            or check out the{' '}
                            <Link href={`${dashboardUrl}/map`} style={link}>
                                interactive map
                            </Link>{' '}
                            to see what's happening in your area.
                        </Text>

                        <Text style={textSmall}>
                            Built with transparency and hope. MIT License.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
};

const header = {
    padding: '32px 20px',
    textAlign: 'center' as const,
    backgroundColor: '#4f46e5',
};

const logo = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0',
};

const tagline = {
    color: '#e0e7ff',
    fontSize: '14px',
    margin: '8px 0 0',
};

const content = {
    padding: '0 48px',
};

const h1 = {
    color: '#1f2937',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0 20px',
    padding: '0',
};

const h2 = {
    color: '#1f2937',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '24px 0 16px',
};

const text = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '16px 0',
};

const textSmall = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '12px 0',
};

const feature = {
    margin: '24px 0',
};

const featureTitle = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 8px',
};

const featureText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0',
};

const button = {
    backgroundColor: '#4f46e5',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '16px 32px',
    margin: '32px 0',
};

const verification = {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '24px',
    margin: '32px 0',
};

const verificationItem = {
    color: '#4b5563',
    fontSize: '14px',
    margin: '8px 0',
};

const link = {
    color: '#4f46e5',
    textDecoration: 'underline',
};

const footer = {
    borderTop: '1px solid #e5e7eb',
    margin: '32px 48px 0',
    padding: '24px 0 0',
};
