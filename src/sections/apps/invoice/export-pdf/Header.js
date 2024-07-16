'use client';

import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// assets
const Logo = '/assets/images/Logo-ASE-ENG.png';

const textPrimary = '#262626';
const textSecondary = '#8c8c8c';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  detailColumn: {
    marginBottom: '12px',
    flexDirection: 'column',
    flexGrow: 2
  },
  chipTitle: {
    fontSize: '8px',
    padding: 4
  },
  chip: {
    alignItems: 'center',
    borderRadius: '4px',
    marginLeft: 52,
    marginRight: 4,
    marginBottom: 8
  },
  leftColumn: {
    flexDirection: 'column',
    width: 36,
    marginRight: 10,
    paddingLeft: 4,
    marginTop: 4
  },
  image: {
    width: 90,
    height: 50
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  title: {
    color: textPrimary,
    fontSize: '10px'
  },
  caption: {
    color: textSecondary,
    fontSize: '10px'
  }
});

// ==============================|| INVOICE EXPORT - HEADER ||============================== //

const Header = ({ list }) => {
  const theme = useTheme();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          {/* eslint-disable-next-line */}
          <Image src={Logo} style={styles.image} />
          </View>
        <View style={styles.detailColumn}>
          <View
            style={[
              styles.chip,
              {
                backgroundColor:
                  list?.status === 'Plătit'
                    ? theme.palette.success.light + 20
                    : list?.status === 'Neplătit'
                    ? theme.palette.info.light + 20
                    : theme.palette.error.light + 20,
                color:
                  list?.status === 'Plătit'
                    ? theme.palette.success.main
                    : list?.status === 'Neplătit'
                    ? theme.palette.info.main
                    : theme.palette.error.main
              }
            ]}
          >
            <Text style={styles.chipTitle}>{list?.status}</Text>
          </View>
        </View>
      </View>
      <View>
        <View style={[styles.row, { marginTop: 8 }]}>
          <Text style={styles.title}>Data</Text>
          <Text style={styles.caption}> {list?.dataStart && format(new Date(list?.dataStart), 'dd/MM/yyyy')}</Text>
        </View>
        <View style={[styles.row, { marginTop: 8 }]}>
          <Text style={styles.title}>Data de final</Text>
          <Text style={styles.caption}> {list?.dataFinal && format(new Date(list?.dataFinal), 'dd/MM/yyyy')}</Text>
        </View>
      </View>
    </View>
  );
};

Header.propTypes = {
  list: PropTypes.object
};

export default Header;
