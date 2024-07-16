import PropTypes from 'prop-types';
import './globals.css';

// PROJECT IMPORTS
import ProviderWrapper from './ProviderWrapper';

export const metadata = {
  title: 'Academia de Studii Economice',
  description: 'Academia de Studii Economice'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node
};
