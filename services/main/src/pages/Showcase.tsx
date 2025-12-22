import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { Spinner } from '@/components/atoms/Spinner/Spinner';
import { Switch } from '@/components/atoms/Switch/Switch';
import { Range } from '@/components/atoms/Range/Range';
import { ProgressBar } from '@/components/atoms/ProgressBar/ProgressBar';
import { Card } from '@/components/molecules/Card/Card';
import { FormGroup } from '@/components/molecules/FormGroup/FormGroup';
import { Alert } from '@/components/molecules/Alert/Alert';
import { Header } from '@/components/organisms/Header/Header';
import { Table } from '@/components/molecules/Table/Table';
import { Dropdown, DropdownItem } from '@/components/molecules/Dropdown/Dropdown';
import { RadioGroup } from '@/components/molecules/RadioGroup/RadioGroup';
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup/CheckboxGroup';
import { Tabs } from '@/components/molecules/Tabs/Tabs';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { Accordion } from '@/components/molecules/Accordion/Accordion';
import { Modal } from '@/components/molecules/Modal/Modal';
import { Carousel } from '@/components/molecules/Carousel/Carousel';
import { useToast } from '@/components/molecules/Toast/Toast';
import type { NavItem } from '@/components/organisms/Header/types'; 

// Define dummy navigation items for the showcase header
const DUMMY_NAV: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Docs', path: '/docs' },
  { 
    label: 'Products', // <-- FIX APPLIED HERE
    children: [
      { label: 'Category 1', path: '/products/1' },
      { label: 'Category 2', path: '/products/2' },
    ]
  }
];

// Content for the Tabs Demo
const TAB_DATA = [
  { 
    label: 'Profile', 
    key: 'profile', 
    content: (
      <div>
        <h3>User Profile Settings</h3>
        <p>This panel shows the profile configuration. It uses the same card-like styling as a base container.</p>
        <FormGroup label="Name" id="tab-name">
          <Input id="tab-name" placeholder="Enter Name" />
        </FormGroup>
        <Button size="sm">Save Profile</Button>
      </div>
    )
  },
  { 
    label: 'Security', 
    key: 'security', 
    content: (
      <div>
        <h3>Security Log</h3>
        <p>Review recent login attempts and security events. This is a crucial tab for account safety.</p>
        <Table 
              columns={[
                { key: 'event', header: 'Event' },
                { key: 'ip', header: 'IP' }
              ]}
              data={[
                { event: 'Login Success', ip: '1.2.3.4' },
                { event: 'Password Change', ip: '5.6.7.8' }
              ]}
            />
      </div>
    ) 
  },
  { 
    label: 'Notifications', 
    key: 'notifications', 
    content: (
      <div>
        <h3>Notification Settings</h3>
        <p>Control what alerts you receive.</p>
        <Switch 
          id="email-alerts"
          label="Email Alerts"
          checked={true}
          onChange={() => console.log('Toggled email')}
        />
      </div>
    ) 
  }
];

// Component for the reusable sub-title style
const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <h4 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>{children}</h4>
);

// Component for displaying code snippets
const CodeBlock = ({ children }: { children: string }) => (
  <pre style={{ 
      backgroundColor: '#1e1e1e', 
      padding: '0.75rem', 
      borderRadius: '4px', 
      overflowX: 'auto', 
      fontSize: '0.85rem',
      margin: '1rem 0'
  }}>
    <code style={{ color: '#d4d4d4' }}>{children.trim()}</code>
  </pre>
);


// NOTICE: We use 'export const' here, not 'export default'
export const Showcase = () => {
  // State for Switch Demos
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(false);
  // State for Range Demo
  const [volume, setVolume] = useState(50);
  // State for Pagination Demo
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  // State for ProgressBar Demo
  const [downloadProgress, setDownloadProgress] = useState(0); 
  // State for Modal Demo
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  // HOOK FOR TOAST
  const { showToast } = useToast();

  // Dynamic progress simulation
  useEffect(() => {
    if (downloadProgress < 100) {
      const timer = setTimeout(() => {
        setDownloadProgress(prev => Math.min(100, prev + 10));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [downloadProgress]);
  
  return (
    <>
      <Header 
        siteName="Wade-USA Demo"
        mainNav={DUMMY_NAV}
        onLogin={() => alert('Login Clicked')}
      />

      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-family)' }}>
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Wade-USA Design System</h1>
          <p style={{ opacity: 0.7 }}>
            A showcase of dynamic, theme-aware components powered by Directus.
          </p>
        </header>

        {/* --- ATOMS --- */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)', borderBottom: '1px dashed #333', paddingBottom: '0.5rem' }}>1. Atoms</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Buttons (Interactive Elements)</SubTitle>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button>Primary Action</Button>
              <Button variant="outline">Secondary Action</Button>
              <Button variant="danger">Destructive</Button>
              <Button isLoading>Loading State</Button>
            </div>
            <CodeBlock>{`
<Button>Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="danger">Destructive</Button>
<Button isLoading>Loading State</Button>
            `}</CodeBlock>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Progress Bars (Visual Feedback)</SubTitle>
            <ProgressBar 
              value={downloadProgress} 
              label="File Download Progress"
              height="8px"
            />
            <ProgressBar 
              value={75} 
              label="Memory Usage (Danger)"
              variant="danger"
              height="1rem"
            />
            <CodeBlock>{`
<ProgressBar 
  value={downloadProgress} 
  label="File Download Progress"
  height="8px"
/>
<ProgressBar 
  value={75} 
  label="Memory Usage"
  variant="danger"
/>
            `}</CodeBlock>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Switches (Binary Toggles)</SubTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <Switch 
                id="notifications-toggle"
                label="Enable Push Notifications"
                checked={isNotificationsEnabled}
                onChange={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
              />
              <Switch 
                id="update-toggle"
                label="Automatic Updates (Disabled)"
                checked={isAutoUpdateEnabled}
                onChange={() => setIsAutoUpdateEnabled(!isAutoUpdateEnabled)}
                disabled
              />
            </div>
            <CodeBlock>{`
const [enabled, setEnabled] = useState(true);

<Switch 
  id="notifications-toggle"
  label="Enable Push Notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
<Switch 
  id="update-toggle"
  label="Disabled Switch"
  checked={false}
  disabled
/>
            `}</CodeBlock>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Ranges (Value Sliders)</SubTitle>
            <Range
              id="volume-slider"
              label={`System Volume (Current: ${volume})`}
              min={0}
              max={100}
              step={1}
              initialValue={volume}
              onChange={setVolume}
            />
            <Range
              id="opacity-slider"
              label="Opacity (0.1 step)"
              min={0}
              max={1}
              step={0.1}
              initialValue={0.5}
            />
            <CodeBlock>{`
const [vol, setVol] = useState(50);

<Range
  id="volume-slider"
  label={\`System Volume (Current: \${vol})\`}
  min={0}
  max={100}
  step={1}
  onChange={setVol}
/>
<Range
  id="opacity-slider"
  label="Opacity (0.1 step)"
  min={0}
  max={1}
  step={0.1}
  initialValue={0.5}
/>
            `}</CodeBlock>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Inputs (Text & Value Entry)</SubTitle>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
              <Input placeholder="Standard Placeholder" />
              <Input error="Invalid input state" value="Wrong Value" readOnly />
            </div>
            <CodeBlock>{`
<Input placeholder="Standard Placeholder" />
<Input 
  error="Invalid input state" 
  value="Wrong Value" 
  readOnly 
/>
            `}</CodeBlock>
          </div>

          <div>
            <SubTitle>Loaders (Spinners)</SubTitle>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <CodeBlock>{`
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
            `}</CodeBlock>
          </div>
        </section>

        {/* --- MOLECULES --- */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)', borderBottom: '1px dashed #333', paddingBottom: '0.5rem' }}>2. Molecules</h2>
          
          {/* --- CAROUSEL DEMO --- */}
          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Carousel (Content Slider - Default Size)</SubTitle>
            <Carousel>
              {/* Slide 1: Image Slide */}
              <img src="https://picsum.photos/600/350?random=1" alt="Abstract city lights background" />
              
              {/* Slide 2: Text Content Slide (Wrapped in Card) */}
              <Card style={{ margin: '0', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} title="Slide 2: Dynamic Theming">
                <p>Content slides (like Cards) are automatically centered. This slide uses theme color for the title.</p>
                <Button size="sm" style={{ marginTop: '1rem' }}>Learn More</Button>
              </Card>
            </Carousel>
            <CodeBlock>{`
// Default Size Example (max-width: 600px, height: 350px)
<Carousel>
  <img src="/assets/image1.jpg" />
  <Card title="Text Slide" />
</Carousel>
            `}</CodeBlock>

            <SubTitle>Carousel (Custom Size Banner)</SubTitle>
            <Carousel height="200px" maxWidth="100%" width="100%">
                <img src="https://picsum.photos/1200/200?random=2" alt="Wide banner background" />
                {/* Text slide content wrapped in a div */}
                <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <h3 style={{ color: 'var(--primary-color)', fontSize: '2rem'}}>Adjustable Height Banner</h3>
                  <p style={{ color: 'var(--primary-color)' }}>This demonstrates flexible sizing via props.</p>
                </div>
            </Carousel>
            <CodeBlock>{`
// Custom Size Example (100% width, Shorter height for a banner)
<Carousel height="200px" maxWidth="100%" width="100%">
    <img src="/assets/banner.jpg" />
    <div style={{ color: 'white' }}>Banner Text</div>
</Carousel>
            `}</CodeBlock>
          </div>
          {/* --- END CAROUSEL DEMO --- */}

          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Toasts (Non-Modal Notifications)</SubTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Button 
                    onClick={() => showToast("Success! Your settings were saved.", 'success')}
                    variant="primary"
                    size="sm"
                >
                    Success
                </Button>
                <Button 
                    onClick={() => showToast("Error connecting to the API.", 'error')}
                    variant="danger"
                    size="sm"
                >
                    Error
                </Button>
            </div>
            <CodeBlock>{`
// Import hook at component level: const { showToast } = useToast();
<Button onClick={() => showToast("Success! Saved.", 'success')}>
  Success
</Button>
<Button onClick={() => showToast("Error connecting.", 'error')}>
  Error
</Button>
            `}</CodeBlock>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Modal / Dialog</SubTitle>
            <Button onClick={() => setIsModalOpen(true)}>Open Theme Settings</Button>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Global Theme Configuration"
            >
              <FormGroup label="Accent Color" id="modal-accent">
                <Input id="modal-accent" placeholder="#3B82F6" defaultValue="#3B82F6" />
              </FormGroup>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <Button onClick={() => { setIsModalOpen(false); showToast('Settings Saved!', 'success'); }}>Save Changes</Button>
              </div>
            </Modal>
            <CodeBlock>{`
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Configuration"
>
  {/* Modal Content Here */}
</Modal>
            `}</CodeBlock>
          </div>
          
          <div style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto' }}>
              <SubTitle>Accordion (Collapsible Content)</SubTitle>
              <Accordion title="What is a Golden Template?">
                  <p>The Golden Template is the reusable, authenticated, and themed React starter kit.</p>
              </Accordion>
              <Accordion title="Deployment Strategy (Advanced)?" isOpenDefault={true}>
                  <p>The deployment utilizes a multi-stage Docker build process.</p>
              </Accordion>
              <CodeBlock>{`
<Accordion title="What is a Golden Template?">
  <p>Content goes here.</p>
</Accordion>
<Accordion title="Advanced Deployment" isOpenDefault={true}>
  <p>Starts open.</p>
</Accordion>
            `}</CodeBlock>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Tabs (Content Organization)</SubTitle>
            <Tabs tabs={TAB_DATA} initialTabKey="security" />
            <CodeBlock>{`
const TAB_DATA = [
  { label: 'Profile', key: 'profile', content: <ProfileForm /> },
  { label: 'Security', key: 'security', content: <SecurityLog /> },
];
<Tabs tabs={TAB_DATA} initialTabKey="security" />
            `}</CodeBlock>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Checkbox Group (Multi-Select)</SubTitle>
            <CheckboxGroup
              name="features"
              legend="Select Features"
              options={[
                { label: 'Receive Monthly Newsletter', value: 'newsletter' },
                { label: 'I agree to the Terms of Service', value: 'terms' },
              ]}
              initialValues={['newsletter']}
              onChange={(values) => console.log('Checked:', values)}
            />
            <CodeBlock>{`
const options = [
  { label: 'Newsletter', value: 'nl' },
  { label: 'Terms', value: 'terms' },
];

<CheckboxGroup
  name="features"
  legend="Select Features"
  options={options}
  initialValues={['nl']}
  onChange={handleSelection}
/>
            `}</CodeBlock>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Radio Group (Single Select)</SubTitle>
            <RadioGroup
              name="notificationPreference"
              legend="Notification Preference"
              options={[
                { label: 'Email only (Standard)', value: 'email' },
                { label: 'Email & SMS (Premium)', value: 'sms_email' },
              ]}
              defaultValue="email"
            />
            <CodeBlock>{`
const options = [
  { label: 'Email', value: 'email' },
  { label: 'sms', value: 'sms' },
];

<RadioGroup
  name="notifications"
  legend="Notification Preference"
  options={options}
  defaultValue="email"
/>
            `}</CodeBlock>
          </div>


          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Alerts (Feedback Messages)</SubTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Alert type="success" message="Success! Your settings have been saved." />
              <Alert type="error" message="Error! Something went wrong connecting to the server." />
            </div>
            <CodeBlock>{`
<Alert type="success" message="Successfully saved!" />
<Alert type="error" message="Failed to connect to server." />
            `}</CodeBlock>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Dropdown Menu (Contextual Options)</SubTitle>
            <div style={{ display: 'flex', justifyContent: 'flex-start', paddingBottom: '20px' }}>
               <Dropdown trigger={<Button variant="outline">User Options ▼</Button>}>
                  <DropdownItem onClick={() => alert('Profile Clicked')}>My Profile</DropdownItem>
                  <DropdownItem onClick={() => alert('Settings Clicked')}>Account Settings</DropdownItem>
               </Dropdown>
            </div>
            <CodeBlock>{`
<Dropdown trigger={<Button>Options</Button>}>
  <DropdownItem onClick={() => console.log('Edit')}>Edit</DropdownItem>
  <DropdownItem onClick={() => console.log('Delete')}>Delete</DropdownItem>
</Dropdown>
            `}</CodeBlock>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Form Groups (Label + Input + Error)</SubTitle>
            <div style={{ maxWidth: '400px' }}>
              <FormGroup label="Email" id="email" error="This email is already taken">
                <Input id="email" value="taken@example.com" error="true" readOnly />
              </FormGroup>
            </div>
            <CodeBlock>{`
<FormGroup label="Email" id="email" error={errors.email}>
  <Input id="email" value={email} onChange={handleChange} />
</FormGroup>
            `}</CodeBlock>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Data Table</SubTitle>
            <Table 
              columns={[
                { key: 'name', header: 'Employee Name' },
                { key: 'role', header: 'Job Title' },
              ]}
              data={[
                { name: `Item ${currentPage * 3 - 2}`, role: 'Role A' },
              ]}
            />
            <CodeBlock>{`
const columns = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' }
];
const data = [
  { name: 'Wade', role: 'Mercenary' },
];
<Table columns={columns} data={data} />
            `}</CodeBlock>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <SubTitle>Pagination (List Navigation)</SubTitle>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageRange={2} 
            />
            <CodeBlock>{`
const [page, setPage] = useState(1);
<Pagination 
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
  pageRange={2}
/>
            `}</CodeBlock>
          </div>
        </section>

        {/* --- LIVE DEMO --- */}
        <section>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)', borderBottom: '1px dashed #333', paddingBottom: '0.5rem' }}>3. Live Demo: Login Card</h2>
          <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--secondary-color)', padding: '3rem', borderRadius: '8px', border: '1px solid #333' }}>
            <Card title="Portal Login" style={{ width: '100%', maxWidth: '350px' }}>
              <form onSubmit={(e) => e.preventDefault()}>
                <FormGroup label="Email" id="login-email">
                  <Input id="login-email" type="email" placeholder="you@wade-usa.com" />
                </FormGroup>
                <FormGroup label="Password" id="login-pass">
                  <Input id="login-pass" type="password" placeholder="••••••••" />
                </FormGroup>
                <Button 
                    style={{ width: '100%', marginTop: '1rem' }} 
                    onClick={() => showToast("Attempting Sign In...", 'info', 1000)}
                >
                    Sign In
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
};