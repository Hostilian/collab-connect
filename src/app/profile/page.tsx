// This is the profile page. If you don't have a profile, well, that's on you.
import Gravatar from '../../components/Gravatar';

export default function ProfilePage() {
  // Let's pretend we have a user. If not, just show a sad face.
  const user = {
    email: 'norm@example.com',
    verified: true,
    collaborations: 3,
  };
  return (
    <div>
      <h1>Profile</h1>
      <Gravatar email={user.email} />
      <p>Status: {user.verified ? 'Verified' : 'Unverified'}</p>
      <p>Collaborations: {user.collaborations}</p>
    </div>
  );
}
