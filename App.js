import React, { Component } from 'react';
import ListView from "deprecated-react-native-listview";
import { 
    AppRegistry,
 
    NativeAppEventEmitter, 
    View, 
    Text, 
    Button } from 'react-native';
import BleManager from 'react-native-ble-manager';

export default class App extends Component {
    constructor(props){
        super(props);

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.devices = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.devices)
        };
    }

    componentDidMount() {

        NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral',(data) => 
        {
            
            let device = 'device found: ' + data.name + '(' + data.id + ')'; 

            if(this.devices.indexOf(device) == -1) {
                this.devices.push(device);
            }

            let newState = this.state;
            newState.dataSource = newState.dataSource.cloneWithRows(this.devices);
            this.setState(newState);

        });

        BleManager.start({showAlert: false})
                  .then(() => {
                            // Success code 
                            console.log('Module initialized');
                            });

                        
    }

    startScanning() {
       console.log('start scanning');
       
       BleManager.scan([], 120).then((result)=>{
           console.log(result)
       })
    }

    
    render() {
        return (
            <View style={{padding: 50 }}>
                <Text>Bluetooth scanner</Text>
                <Button onPress={() => this.startScanning()} title="Start scanning"/>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text>{rowData}</Text>}
                />
            </View>
        );
    }
}

//AppRegistry.registerComponent('BluetoothScanner', () => BluetoothScanner);