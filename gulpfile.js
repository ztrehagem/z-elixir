const Zelixir = require('./app');
const Resource = Zelixir.Resource;
const Task = Zelixir.Task;

const config = Zelixir.config;
config.enabledNgAnnotate = true;
config.enabledBabel = true;

Resource('html', Resource.template('html'));
Resource('js', Resource.template('js'));
Resource('sass', Resource.template('sass'));

Task('html', ['html'], Task.template('html'));
Task('js', ['js'], Task.template('js'));
Task('sass', ['sass'], Task.template('sass'));

// Task.esnext(Resource.template('esnext'));

Task.default();
Task.watch();
