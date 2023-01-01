/* support functions */

/**
 * Whisper a system message to the GM
 * @param {*} speaker 
 * @param {*} content 
 */
export function simpleGMWhisper(speaker, content) {
    let gmChatOptions = {
        content: content,
        speaker: speaker,
        whisper: ChatMessage.getWhisperRecipients("GM")
    };
    ChatMessage.create(gmChatOptions);
}
