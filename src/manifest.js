
import deploy from 'busyweb/commands/deploy';
import docker from 'busyweb/commands/docker';
import ember from 'busyweb/commands/ember';
import local from 'busyweb/commands/local';
import release from 'busyweb/commands/release';
import template from 'busyweb/commands/template';

const COMMANDS = [
	deploy,
	docker,
	ember,
	local,
	release,
	template
];

export default function init() {
	return COMMANDS.map(Command => {
		return new Command(process.__busyweb.program);
	});
}
