import React, { useState, useEffect, FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressProps {
    progress: number
}

const ProgressBar : FC<ProgressProps> = ({ progress }) => {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    setProgressWidth(progress * 100);
  }, [progress]);

  return (
      <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progressWidth}%` }]}></View>
      </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    marginHorizontal: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
    height: 20,
    width: '100%',
  },
  progressBar: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  progressText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30
  },
});

export default ProgressBar;
