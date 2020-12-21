import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { actions, defaultActions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const Main = ({ song }) => {
	const richText = React.useRef(null);

	function renderHtml(body: string) {
		return `<html>
      <head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>
      <body><pre>${body}</pre></body>
    </html>`;
	}

	if (!song) return <Text>Carregando...</Text>;

	return (
		<RichEditor
			initialFocus={true}
			// disabled={disabled}
			// editorStyle={contentStyle} // default light style
			// containerStyle={themeBg}
			ref={richText}
			style={[styles.rich]}
			placeholder={'please input content'}
			initialContentHTML={song.letra ? renderHtml(song.letra) : ''}
			// editorInitializedCallback={that.editorInitializedCallback}
			// onChange={that.handleChange}
			// onHeightChange={that.handleHeightChange}
			// onPaste={that.handlePaste}
			// onKeyUp={that.handleKeyUp}
			// onKeyDown={that.handleKeyDown}
			// onMessage={that.handleMessage}
			// onFocus={that.handleFocus}
			// onBlur={that.handleBlur}
			// pasteAsPlainText={true}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	nav: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 5,
	},
	rich: {
		minHeight: 300,
		flex: 1,
	},
	richBar: {
		height: 50,
		backgroundColor: '#F5FCFF',
		borderColor: '#e8e8e8',
		borderTopWidth: StyleSheet.hairlineWidth,
	},
	scroll: {
		backgroundColor: '#ffffff',
	},
	item: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: '#e8e8e8',
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
		paddingHorizontal: 15,
	},

	input: {
		flex: 1,
	},

	tib: {
		textAlign: 'center',
		color: '#515156',
	},

	Keyboard: {
		position: 'absolute',
		// bottom: 50 + getBottomSpace(),
		right: 8,
		alignSelf: 'flex-end',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Main;
