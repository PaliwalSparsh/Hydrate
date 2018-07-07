import React from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	LayoutAnimation,
	UIManager,
	Platform,
	AsyncStorage,
	AppState,
} from 'react-native';
import { LinearGradient, Constants, Svg, Notifications } from 'expo';

const CBButton = ({ onPress, colors, text }) => (
	<TouchableOpacity onPress={onPress}>
		<LinearGradient
			start={{ x: 0, y: 0.75 }}
			end={{ x: 1, y: 0.25 }}
			colors={colors}
			style={styles.gradStyle}
		>
			<Text style={styles.buttonTextStyle}>{text}</Text>
		</LinearGradient>
	</TouchableOpacity>
);

export default class App extends React.Component {
	constructor() {
		super();

		if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental &&
				UIManager.setLayoutAnimationEnabledExperimental(true);
		}
		this.state = {
			desiredConsumption: 3,
			toBeConsumed: 3,
		};
	}

	async componentWillMount() {
		if ((await this.retrieveData()) === null) {
			this.enableNotification();
			await this.storeData(3);
		} else {
			const toBeConsumed = await this.retrieveData();
			this.setState({ toBeConsumed });
		}
	}

	componentWillUpdate() {
		LayoutAnimation.spring();
	}

	onPressButton = async consumed => {
		if (this.state.toBeConsumed > 0) {
			const toBeConsumed = this.state.toBeConsumed - consumed;
			if (toBeConsumed > 0) {
				await this.storeData(toBeConsumed);
				this.setState({ toBeConsumed });
			} else {
				await this.storeData(0);
				this.setState({ toBeConsumed: 0 });
			}
		}
	};

	storeData = async value => {
		try {
			await AsyncStorage.setItem('toBeConsumed', String(value));
			console.log('storing works');
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	retrieveData = async () => {
		try {
			const value = await AsyncStorage.getItem('toBeConsumed');
			console.log('retrieval works');
			if (value !== null) {
				return Number(value);
			} else {
				return null;
			}
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	disableNotification = () => {
		Notifications.cancelAllScheduledNotificationsAsync();
	}

	enableNotification = () => {
		Notifications.cancelAllScheduledNotificationsAsync();
		const localNotification = (title, body) => ({
			title,
			body,
			android: {
				sound: true,
				priority: 'high',
				sticky: false,
				vibrate: true,
			},
		});
		const schedulingOptions = (date = 'July 7 2018 16:10') => ({
			time: new Date(date),
			repeat: 'day',
		});
		Notifications.scheduleLocalNotificationAsync(
			localNotification('Hydrate - 1', 'Start your day with some water.'),
			schedulingOptions('July 7 2018 8:00')
		);
		Notifications.scheduleLocalNotificationAsync(
			localNotification('Hydrate - 2', 'Its time to get Hydrated.'),
			schedulingOptions('July 7 2018 11:00')
		);
		Notifications.scheduleLocalNotificationAsync(
			localNotification('Hydrate - 3', 'Wew, its afternoon maybe some water can help.'),
			schedulingOptions('July 7 2018 13:00')
		);
		Notifications.scheduleLocalNotificationAsync(
			localNotification('Hydrate - 4', 'Cmon, lets drink some water.'),
			schedulingOptions('July 7 2018 15:00')
		);
		Notifications.scheduleLocalNotificationAsync(
			localNotification('Hydrate - 5', 'You know whats better than some water, more water.'),
			schedulingOptions('July 7 2018 17:00')
		);
		Notifications.scheduleLocalNotificationAsync(
			localNotification('Hydrate - 6', 'Good Evening, Drink water friends.'),
			schedulingOptions('July 7 2018 19:00')
		);
		Notifications.scheduleLocalNotificationAsync(
			localNotification('Hydrate - 7', 'Such a long day, refresh yourself with some water.'),
			schedulingOptions('July 7 2018 21:00')
		);
		Notifications.scheduleLocalNotificationAsync(
			localNotification('Hydrate - 8', 'Time to go to bed, but first some water.'),
			schedulingOptions('July 7 2018 23:00')
		);
	};

	render() {
		console.log('toBeConsumed', this.state.toBeConsumed);
		const buttons = [
			{
				text: '0.25 L',
				onPress: () => {
					this.onPressButton(0.25);
				},
				colors: ['#0052D4', '#0052D4'],
			},
			{
				text: '0.50 L',
				onPress: () => {
					this.onPressButton(0.5);
				},
				colors: ['#0052D4', '#0052D4'],
			},
			{
				text: '0.75 L',
				onPress: () => {
					this.onPressButton(0.75);
				},
				colors: ['#0052D4', '#0052D4'],
			},
			{
				text: '1 L',
				onPress: () => {
					this.onPressButton(1);
				},
				colors: ['#0052D4', '#0052D4'],
			},
		];
		const barWidth = 300;
		const fraction =
			(this.state.desiredConsumption - this.state.toBeConsumed) / this.state.desiredConsumption;
		const toBeConsumedFraction = barWidth * fraction;
		return (
			<View style={styles.containerStyle}>
				<View style={styles.svgContainerStyle}>
					<Svg height={250} width={400}>
						<Svg.Defs>
							<Svg.LinearGradient id="grad" x1="0" y1="0" x2="170" y2="0">
								<Svg.Stop offset="0" stopColor="#9CECFB" stopOpacity="1" />
								<Svg.Stop offset="1" stopColor="#65C7F7" stopOpacity="1" />
								<Svg.Stop offset="2" stopColor="#0052D4" stopOpacity="1" />
							</Svg.LinearGradient>
						</Svg.Defs>
						<Svg.Rect
							x={50}
							y={50}
							width={barWidth}
							height={70}
							fill="#9CECFB"
							onLongPress={() => this.setState({ toBeConsumed: 3 })}
						/>
						<Svg.Rect
							x={50}
							y={50}
							width={toBeConsumedFraction}
							height={70}
							fill="#0052D4"
							onLongPress={() => this.setState({ toBeConsumed: 3 })}
						/>
						<Svg.Text
							fill="black"
							fillOpacity={0.3}
							fontSize="20"
							x="200"
							y="180"
							textAnchor="middle"
						>
							Long press to reset progress.
						</Svg.Text>
					</Svg>
				</View>
				<View
					style={{
						flex: 1 / 3,
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Text style={{ fontSize: 100, fontWeight: '600' }}>
						{this.state.desiredConsumption - this.state.toBeConsumed}
					</Text>
					<Text style={{ fontSize: 50, fontWeight: '400' }}>/{this.state.desiredConsumption}</Text>
				</View>
				<View style={styles.notificationViewStyle}>
					<TouchableOpacity onPress={this.enableNotification}>
						<Text style={styles.notificationEnableTextStyle}>ENABLE NOTIFICATIONS</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.disableNotification}>
						<Text style={styles.notificationDisableTextStyle}>DISABLE NOTIFICATIONS</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.buttonGroup}>
					{buttons.map(button => (
						<CBButton
							key={button.text}
							onPress={button.onPress}
							colors={button.colors}
							text={button.text}
						/>
					))}
				</View>
			</View>
		);
	}
}

const styles = {
	svgContainerStyle: {
		flex: 1 / 3,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Constants.statusBarHeight,
	},
	buttonGroup: {
		flex: 1 / 5,
		justifyContent: 'space-around',
		alignSelf: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		margin: 5,
	},
	gradStyle: {
		margin: 5,
		marginTop: 10,
		justifyContent: 'center',
		borderRadius: 5,
		height: 48,
		width: 180,
	},
	buttonTextStyle: {
		fontWeight: '800',
		alignSelf: 'center',
		backgroundColor: 'transparent',
		fontSize: 25,
		color: '#fff',
	},
	containerStyle: {
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: '#ecf0f1',
	},
	notificationEnableTextStyle: {
		color: '#0052D4',
		alignSelf: 'center',
		fontWeight: '800',
		marginBottom: 30,
	},
	notificationDisableTextStyle: {
		color: 'gray',
		alignSelf: 'center',
		fontWeight: '800',
		marginBottom: 30,
	},
	notificationViewStyle: {
		flex: 1 / 6,
	},
};
