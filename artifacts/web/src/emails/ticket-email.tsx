import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Img,
  Hr,
  Row,
  Column,
} from "@react-email/components";

interface TicketEmailProps {
  buyerName: string;
  tier: string;
  qrCodeDataUrl: string;
  checkinUrl: string;
}

export function TicketEmail({
  buyerName = "Guest",
  tier = "Standard Entry",
  qrCodeDataUrl = "",
  checkinUrl = "",
}: TicketEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your AfroDeep Ent ticket is confirmed! 🎉</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={brandStyle}>AFRODEEP ENT</Text>
            <Text style={eventNameStyle}>All White Boat Party</Text>
          </Section>

          {/* Confirmation */}
          <Section style={mainSectionStyle}>
            <Text style={confirmTitleStyle}>Your Ticket is Confirmed! 🎉</Text>
            <Text style={greetingStyle}>
              Hey {buyerName}, you&apos;re all set for the most exclusive boat party
              of the year!
            </Text>

            {/* Event Details */}
            <Section style={detailsBoxStyle}>
              <Row>
                <Column style={detailLabelStyle}>📅 Date</Column>
                <Column style={detailValueStyle}>Saturday 15th August 2026</Column>
              </Row>
              <Row>
                <Column style={detailLabelStyle}>📍 Venue</Column>
                <Column style={detailValueStyle}>Westminster Pier, London</Column>
              </Row>
              <Row>
                <Column style={detailLabelStyle}>🚢 Boarding</Column>
                <Column style={detailValueStyle}>7:00 PM</Column>
              </Row>
              <Row>
                <Column style={detailLabelStyle}>⚓ Sets Sail</Column>
                <Column style={detailValueStyle}>8:00 PM</Column>
              </Row>
              <Row>
                <Column style={detailLabelStyle}>👔 Dress Code</Column>
                <Column style={detailValueStyle}>Strictly All White</Column>
              </Row>
            </Section>

            {/* Ticket Tier */}
            <Section style={tierBoxStyle}>
              <Text style={tierLabelStyle}>YOUR TICKET</Text>
              <Text style={tierNameStyle}>{tier}</Text>
            </Section>

            <Hr style={hrStyle} />

            {/* QR Code */}
            <Section style={qrSectionStyle}>
              <Text style={qrTitleStyle}>YOUR ENTRY QR CODE</Text>
              <Text style={qrSubtitleStyle}>
                Show this QR code at the door for entry
              </Text>
              <Img
                src="cid:qrcode"
                alt="Ticket QR Code"
                width="200"
                height="200"
                style={qrImageStyle}
              />
              <Text style={qrNoteStyle}>
                Please save or screenshot this QR code. You will need it to
                enter the event.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Tickets are non-refundable • All sales final • ID required on
              entry
            </Text>
            <Text style={footerSubStyle}>
              © 2026 AfroDeep Ent. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ──

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#0d1525",
  fontFamily: "'Outfit', 'Segoe UI', sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  maxWidth: "520px",
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "40px 20px 20px",
};

const brandStyle: React.CSSProperties = {
  color: "#eab308",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.3em",
  margin: 0,
};

const eventNameStyle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: 800,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "4px 0 0",
};

const mainSectionStyle: React.CSSProperties = {
  padding: "0 24px",
};

const confirmTitleStyle: React.CSSProperties = {
  color: "#eab308",
  fontSize: "22px",
  fontWeight: 700,
  textAlign: "center" as const,
  margin: "24px 0 8px",
};

const greetingStyle: React.CSSProperties = {
  color: "#a0aec0",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const detailsBoxStyle: React.CSSProperties = {
  backgroundColor: "#1a2436",
  border: "1px solid rgba(234,179,8,0.15)",
  padding: "20px",
  marginBottom: "16px",
};

const detailLabelStyle: React.CSSProperties = {
  color: "#a0aec0",
  fontSize: "12px",
  padding: "6px 0",
  width: "120px",
};

const detailValueStyle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: 600,
  padding: "6px 0",
};

const tierBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(234,179,8,0.08)",
  border: "1px solid rgba(234,179,8,0.25)",
  padding: "16px",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const tierLabelStyle: React.CSSProperties = {
  color: "#a0aec0",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  margin: "0 0 4px",
};

const tierNameStyle: React.CSSProperties = {
  color: "#eab308",
  fontSize: "20px",
  fontWeight: 800,
  textTransform: "uppercase" as const,
  margin: 0,
};

const hrStyle: React.CSSProperties = {
  borderColor: "rgba(234,179,8,0.15)",
  margin: "8px 0",
};

const qrSectionStyle: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const qrTitleStyle: React.CSSProperties = {
  color: "#eab308",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.2em",
  margin: "0 0 4px",
};

const qrSubtitleStyle: React.CSSProperties = {
  color: "#a0aec0",
  fontSize: "13px",
  margin: "0 0 20px",
};

const qrImageStyle: React.CSSProperties = {
  margin: "0 auto",
  borderRadius: "8px",
  border: "4px solid #ffffff",
};

const qrNoteStyle: React.CSSProperties = {
  color: "#718096",
  fontSize: "11px",
  fontStyle: "italic" as const,
  margin: "16px 0 0",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "24px 20px 40px",
};

const footerTextStyle: React.CSSProperties = {
  color: "#718096",
  fontSize: "10px",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  margin: "0 0 8px",
};

const footerSubStyle: React.CSSProperties = {
  color: "#4a5568",
  fontSize: "10px",
  margin: 0,
};

export default TicketEmail;
