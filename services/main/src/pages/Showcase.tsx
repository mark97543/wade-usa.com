import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { Spinner } from '@/components/atoms/Spinner/Spinner';
import { Card } from '@/components/molecules/Card/Card';
import { FormGroup } from '@/components/molecules/FormGroup/FormGroup';
import { Alert } from '@/components/molecules/Alert/Alert';
import { Header } from '@/components/organisms/Header/Header';
import { Table } from '@/components/molecules/Table/Table';
import { Dropdown, DropdownItem } from '@/components/molecules/Dropdown/Dropdown';

// NOTICE: We use 'export const' here, not 'export default'
export const Showcase = () => {
  return (
    <>
      <Header />

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
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Buttons</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button>Primary Action</Button>
              <Button variant="outline">Secondary Action</Button>
              <Button variant="danger">Destructive</Button>
              <Button isLoading>Loading State</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Inputs</h3>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
              <Input placeholder="Standard Placeholder" />
              <Input value="Filled Value" readOnly />
              <Input error="Invalid input state" value="Wrong Value" readOnly />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Loaders</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </div>
        </section>

        {/* --- MOLECULES --- */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)', borderBottom: '1px dashed #333', paddingBottom: '0.5rem' }}>2. Molecules</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Alert type="success" message="Success! Your settings have been saved." />
              <Alert type="error" message="Error! Something went wrong connecting to the server." />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Dropdown Menu</h3>
            {/* Added paddingBottom so the menu has room to open without scrolling */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', paddingBottom: '20px' }}>
               <Dropdown trigger={<Button variant="outline">User Options ▼</Button>}>
                  <DropdownItem onClick={() => alert('Profile Clicked')}>My Profile</DropdownItem>
                  <DropdownItem onClick={() => alert('Settings Clicked')}>Account Settings</DropdownItem>
                  <DropdownItem onClick={() => alert('Logout Clicked')} style={{ color: 'var(--danger-color)' }}>Log Out</DropdownItem>
               </Dropdown>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Form Groups (Label + Input + Error)</h3>
            <div style={{ maxWidth: '400px' }}>
              <FormGroup label="Username" id="username">
                <Input id="username" placeholder="jdoe" />
              </FormGroup>
              <FormGroup label="Email" id="email" error="This email is already taken">
                <Input id="email" value="taken@example.com" error="true" readOnly />
              </FormGroup>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Data Table</h3>
            <Table 
              columns={[
                { key: 'name', header: 'Employee Name' },
                { key: 'role', header: 'Job Title' },
                { key: 'status', header: 'Status' }
              ]}
              data={[
                { name: 'Wade Wilson', role: 'Mercenary', status: 'Active' },
                { name: 'Peter Parker', role: 'Photographer', status: 'Active' },
                { name: 'Tony Stark', role: 'Engineer', status: 'Retired' }
              ]}
            />
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
                <Button style={{ width: '100%', marginTop: '1rem' }}>Sign In</Button>
              </form>
            </Card>
          </div>
        </section>
      </main>
    </>
  )
}