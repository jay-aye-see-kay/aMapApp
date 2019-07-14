import { Button, Nav, Navbar } from 'react-bootstrap';

type Props = {
  addBussiness: () => void;
};

export const Header = ({ addBussiness }: Props) => (
  <Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home">Accessibility Map</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="ml-auto">
      <Button onClick={addBussiness}>Add business</Button>
    </Nav>
  </Navbar.Collapse>
  </Navbar>
)

