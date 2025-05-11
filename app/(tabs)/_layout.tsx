import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Matematik Oyunu',
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
