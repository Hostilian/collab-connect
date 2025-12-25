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
    Text
} from '@react-email/components';

interface VerificationEmailProps {
    readonly name: string;
    readonly verificationUrl: string;
}

export default function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify your Courier Connect account</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={logo}>Courier Connect</Heading>
                        <Text style={tagline}>Prague's courier network. 70% to you.</Text>
                    </Section>

                    <Section style={content}>
                        <Heading style={h1}>Welcome to Courier Connect, {name}!</Heading>

                        <Text style={text}>
                            You're one step away from joining a community that fights insurance denials,
                            collaborates on home purchases, and takes on challenges together.
                        </Text>

                        <Text style={text}>
                            Click the button below to verify your email address and activate your account:
                        </Text>

                        <Button style={button} href={verificationUrl}>
                            Verify My Email
                        </Button>

                        <Text style={text}>
                            Or copy and paste this link into your browser:
                        </Text>

                        <Link href={verificationUrl} style={link}>
                            {verificationUrl}
                        </Link>

                        <Text style={textSmall}>
                            This link will expire in 24 hours for security reasons.
                        </Text>
                    </Section>

                    <Section style={footer}>
                        <Text style={textSmall}>
                            <strong>Why verification matters:</strong> We're building a transparent platform
                            where trust is everything. Email verification is the first step in showing you're
                            real. Later, you can add phone and ID verification to build even more credibility.
                        </Text>

                        <Text style={textSmall}>
                            Didn't create an account? You can safely ignore this email.
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

const link = {
    color: '#4f46e5',
    fontSize: '14px',
    textDecoration: 'underline',
    wordBreak: 'break-all' as const,
};

const footer = {
    borderTop: '1px solid #e5e7eb',
    margin: '32px 48px 0',
    padding: '24px 0 0',
};
