import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';

export default async function GetNetInfo() {
  let res = false;
  const data = NetInfo.fetch();
  // console.log(data);
  // let info = false;
  // await NetInfo.fetch().then(res => {
  //   info = res.isConnected;
  // });
  // console.log(useNetInfo());
  return (await data).isConnected;
}

const styles = StyleSheet.create({});
// async function latestTime(): Promise<some primitive> {
//   const bl = await web3.eth.getBlock('latest');
//   return bl.timestamp;
// }
