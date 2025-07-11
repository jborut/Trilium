import { Autoformat, blockAutoformatEditing, Plugin } from "ckeditor5";
import { AdmonitionType, ADMONITION_TYPES } from "./admonitioncommand.js";

function tryParseAdmonitionType(match: RegExpMatchArray) {
	if (match.length !== 2) {
		return;
	}

	if ((ADMONITION_TYPES as readonly string[]).includes(match[1])) {
		return match[1] as AdmonitionType;
	}
}

export default class AdmonitionAutoformat extends Plugin {

	static get requires() {
		return [ Autoformat ];
	}

	afterInit() {
		if (!this.editor.commands.get("admonition")) {
			return;
		}

		const instance = (this as any);
		blockAutoformatEditing(this.editor, instance, /^\!\!\[*\! (.+) $/, ({ match }) => {
			const type = tryParseAdmonitionType(match);

			if (type) {
				// User has entered the admonition type, so we insert as-is.
				this.editor.execute("admonition", { forceValue: type });
			} else {
				// User has not entered a valid type, assume it's part of the text of the admonition.
				this.editor.execute("admonition");
				if (match.length > 1) {
					this.editor.execute("insertText", { text: (match[1] ?? "") + " " });
				}
			}
		});
	}
}
