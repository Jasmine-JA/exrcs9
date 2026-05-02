import { StyleSheet, Text, View } from 'react-native';

const ObservationCard = ({ icon, title, date, rating = 0 }) => (
  <View style={styles.card}>
    <View style={styles.iconWrap}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.stars}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(8,10,28,0.88)',
    borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: 'rgba(30,58,138,0.25)',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  date: { fontSize: 11, color: 'rgba(200,200,220,0.45)', marginBottom: 4 },
  stars: { fontSize: 12, color: '#A5B4FC' },
});

export default ObservationCard;