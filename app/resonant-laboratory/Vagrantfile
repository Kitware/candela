Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 8192
  end

  host_port = ENV["RESLAB_HOST_PORT"] || 8080

  config.vm.network "forwarded_port", guest: 8080, host: host_port

  config.vm.define "reslab" do |node| end

  # Run Ansible from the Vagrant Host
  config.vm.provision "ansible" do |ansible|
    ansible.verbose = "vvvv"
    ansible.groups = {
      "all" => ['reslab']
    }

    ansible.playbook = "ansible/playbook.yml"
  end
end
