import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', color: '#e74c3c', marginBottom: '1rem' }}>404</h1>
      <h2>Página não encontrada</h2>
      <p style={{ color: '#666', margin: '1rem 0' }}>
        A página que estás a procurar não existe ou foi removida.
      </p>
      <Link to="/" style={styles.btn}>Voltar à Página Inicial</Link>
    </div>
  );
};

const styles = {
  btn: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#3498db',
    color: '#fff',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};