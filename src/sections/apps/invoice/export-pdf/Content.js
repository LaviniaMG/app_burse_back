import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

// Colors and styles definitions
const colors = {
  primary: '#333',
  secondary: '#666',
  accent: '#005bac',
  background: '#f7f7f7',
  border: '#ddd'
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background
  },
  card: {
    border: `1px solid ${colors.border}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 5
  },
  caption: {
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 4
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: 5,
    paddingVertical: 5,
    backgroundColor: colors.accent,
    color: '#fff'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${colors.border}`,
    paddingVertical: 5,
    paddingHorizontal: 2
  },
  tableCell: {
    fontSize: 12,
    color: colors.primary
  },
  bold: {
    fontWeight: 'bold'
  },
  amountSection: {
    marginTop: 10,
    padding: 10,
    borderTop: `1px solid ${colors.border}`,
    alignItems: 'flex-end'
  }
});

// Content Component
const Content = ({ list }) => {
  const subtotal = Number(list?.suma || 0);
  const total = subtotal;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>De la:</Text>
        <Text style={styles.caption}>Academia de Studii Economice din București</Text>
        <Text style={styles.caption}>Piata Romană nr. 6, Sector 1, Bucuresti, 010374</Text>
        <Text style={styles.caption}>Telefon: +40 21.319.19.01</Text>
        <Text style={styles.caption}>Fax: +40 21.319.18.99</Text>
        <Text style={styles.caption}>E-mail: rectorat@ase.ro</Text>
        <Text style={styles.caption}>Website: www.ase.ro</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Pentru:</Text>
        <Text style={styles.caption}>{list?.solicitari?.utilizator?.Nume} {list?.solicitari?.utilizator?.Prenume}</Text>
        <Text style={styles.caption}>{list?.solicitari?.utilizator?.Email}</Text>
        <Text style={styles.caption}>Cont bancar: RO04BTLAG019204850353</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, { flex: 1, color: '#fff' }]}>#</Text>
        <Text style={[styles.tableCell, { flex: 3, color: '#fff' }]}>Denumire Bursa</Text>
        <Text style={[styles.tableCell, { flex: 1, color: '#fff' }]}>Cuantum</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 1 }]}>1</Text>
        <Text style={[styles.tableCell, { flex: 3 }]}>{list?.solicitari?.denumireBursa}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{subtotal.toFixed(2)} LEI</Text>
      </View>

      <View style={styles.amountSection}>
        <Text style={[styles.tableCell, styles.bold]}>Total platit:</Text>
        <Text style={styles.tableCell}>{total % 1 === 0 ? total : total.toFixed(2)} LEI</Text>
      </View>
    </View>
  );
};

Content.propTypes = {
  list: PropTypes.object
};

export default Content;
