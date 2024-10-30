import { UserButton, useUser, RedirectToSignIn } from '@clerk/nextjs';
import { useState } from 'react';

const CustomUserButton = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInstructorDashboardClick = () => {
    window.location.href = '/instructor/courses';
  };

  const isAdmin = user?.organizationMemberships[0]?.role === 'org:admin';

  return (
    <div className="relative inline-block">
      <UserButton
        appearance={{
          elements: {
            userButton: {
              backgroundColor: '#4A90E2',
              borderRadius: '8px',
              padding: '10px 15px',
              color: '#fff',
            },
          },
        }}
        onClick={handleToggleDropdown} // Bật tắt dropdown
      />

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 bg-white border border-gray-200 rounded shadow-lg">
          {isAdmin && (
            <div
              onClick={handleInstructorDashboardClick}
              style={{ cursor: 'pointer', padding: '10px 15px', color: '#333' }}
              className="hover:bg-gray-100"
            >
              Instructor Dashboard
            </div>
          )}
          <div
            onClick={() => { /* Redirect to Clerk's manage account page */ }}
            style={{ cursor: 'pointer', padding: '10px 15px', color: '#333' }}
            className="hover:bg-gray-100"
          >
            Manage Account
          </div>
          <RedirectToSignIn>
            <div
              onClick={() => { /* Logic for signing out */ }}
              style={{ cursor: 'pointer', padding: '10px 15px', color: '#333' }}
              className="hover:bg-gray-100"
            >
              Sign Out
            </div>
          </RedirectToSignIn>
        </div>
      )}
    </div>
  );
};

export default CustomUserButton;
