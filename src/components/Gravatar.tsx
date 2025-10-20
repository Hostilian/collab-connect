// Gravatar. Because people like seeing their own face. Or someone else's.
import { createHash } from 'crypto';
import Image from 'next/image';

export default function Gravatar({ email }: { email: string }) {
  const hash = email ? createHash('md5').update(email.trim().toLowerCase()).digest('hex') : '';
  const url = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  return (
    <Image
      src={url}
      alt="Profile"
      width={64}
      height={64}
      style={{ borderRadius: '50%' }}
    />
  );
}
