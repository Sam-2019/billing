require 'mina/rails'
require 'mina/git'
require 'mina/rvm'

set :application_name, ENV["app"].to_s
set :domain,  ENV["domain"].to_s
set :deploy_to, "#{ENV["home_dir"]}/#{ENV["app"]}"
set :repository, ENV["repository"].to_s
set :branch, ENV["branch"].to_s
set :shared_files, fetch(:shared_files, []).push(".env")

# Optional settings:
set :term_mode, :pretty
set :user, ENV["root"].to_s
set :keep_releases, 2

task :setup do
  command %(mkdir -p #{ENV["home_dir"]})
end

desc 'Deploys the current version to the server.'
task :deploy do
  invoke :'git:ensure_pushed'
  deploy do
    comment "Deploying #{fetch(:application_name)} to #{fetch(:domain)}:#{fetch(:deploy_to)}"
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'deploy:cleanup'

    on :launch do
      # comment out :shutdwon on first deploy
      invoke :shutdown
      invoke :bun_install
      # comment out :delete_app on first deploy
      invoke :delete_app
      invoke :start_app
    end
  end
end

desc "install bun packages"
task :bun_install do
  command %(bun install --production)
end


desc "start app"
task :start_app do
    in_path(fetch(:current_path)) do
    command %(pm2 start ./api/index.js --name #{fetch(:application_name)} --log-date-format 'ddd, MMM D, YYYY h:mm:ss A')
    command %(pm2 save)
  end
end

desc "restart app"
task :restart do
  in_path(fetch(:current_path)) do
    command %(pm2 restart #{fetch(:application_name)} --log-date-format 'ddd, MMM D, YYYY h:mm:ss A')
  end
end

desc "reload app"
task :reload do
  in_path(fetch(:current_path)) do
    command %(pm2 reload #{fetch(:application_name)} --update-env --log-date-format 'ddd, MMM D, YYYY h:mm:ss A')
  end
end

desc "shutdown app"
task :shutdown do
  in_path(fetch(:current_path)) do
    command %(pm2 stop #{fetch(:application_name)} --log-date-format 'ddd, MMM D, YYYY h:mm:ss A')
  end
end

desc "delete app"
task :delete_app do
  command %(pm2 delete #{fetch(:application_name)})
end

desc "show app logs"
task logs: :remote_environment do
  command %(pm2 logs --lines 100)
end

desc "flush app logs"
task flush: :remote_environment do
  command %(pm2 flush 0)
end

desc "pm2 cli dashboard"
task monit: :remote_environment do
  command %(pm2 monit)
end

desc "app metadata"
task meta: :remote_environment do
  command %(pm2 show #{fetch(:application_name)} --log-date-format 'ddd, MMM D, YYYY h:mm:ss A')
end

desc "list apps"
task list: :remote_environment do
  command %(pm2 list)
end

desc "rollback last deployment"
task rollback: :remote_environment do
    in_path(fetch(:current_path)) do
    command %(pm2 stop #{fetch(:application_name)} --log-date-format 'ddd, MMM D, YYYY h:mm:ss A')
    command %(pm2 delete #{fetch(:application_name)})
    command %(pm2 start ./api/index.js --name #{fetch(:application_name)} --log-date-format 'ddd, MMM D, YYYY h:mm:ss A')
    command %(pm2 save)
  end
end