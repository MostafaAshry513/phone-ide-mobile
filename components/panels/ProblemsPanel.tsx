import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME } from '../../lib/store';
const C = THEME.dark;

interface ProblemsPanelProps { visible: boolean; onClose: () => void; }
export default function ProblemsPanel({ visible, onClose }: ProblemsPanelProps) {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Problems (0)</Text>
        <TouchableOpacity onPress={onClose}><Text style={styles.close}>✕</Text></TouchableOpacity>
      </View>
      <FlatList data={[]} keyExtractor={(_,i)=>String(i)} renderItem={()=>null} style={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No problems detected</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:C.surface,borderTopWidth:2,borderTopColor:C.amber,borderTopLeftRadius:12,borderTopRightRadius:12,maxHeight:'55%',zIndex:18},
  header:{flexDirection:'row',justifyContent:'space-between',padding:10,borderBottomWidth:1,borderBottomColor:C.border},
  title:{fontSize:10,color:C.text,fontFamily:Platform.OS==='ios'?'Menlo':'monospace'},
  close:{fontSize:14,color:C.textFaint},
  list:{flex:1},
  empty:{padding:20,textAlign:'center',color:C.textFaint,fontSize:11},
});
