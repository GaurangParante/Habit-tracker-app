# Habit Tracker App

Offline-first Android habit tracker built with React Native CLI, TypeScript, Redux Toolkit, React Navigation, React Native Paper, and SQLite.

## Features

- 100% local-first data model with `react-native-sqlite-storage`
- Habits, habit logs, todos, achievements, and settings persisted in SQLite
- Redux used only for UI state like theme and filters
- Bottom tab navigation plus stack flows for forms and settings
- Seed data included for quick local testing

## Project Structure

```text
src/
  components/
  database/
  hooks/
  navigation/
  screens/
  services/
  store/
  types/
  utils/
```

## Install

```bash
npm install
```

Install iOS pods only if you later add iOS support:

```bash
cd ios && pod install && cd ..
```

## Run on Android

1. Install Android Studio and an SDK/device emulator.
2. Start Metro:

```bash
npm start
```

3. In a second terminal, build and run:

```bash
npm run android
```

## Offline Architecture

- SQLite is the single source of truth
- All CRUD flows pass through repository and service layers
- Achievements are evaluated locally from habit logs
- Theme preference is stored in the local `Settings` table
- Device local date is used for habit generation and overdue detection
