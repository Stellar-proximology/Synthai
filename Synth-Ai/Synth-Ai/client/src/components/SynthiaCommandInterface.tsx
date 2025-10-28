import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const commandTemplates = {
  "science_lab": "Create more Science Lab Dashboard applications for monitoring city data and agent behaviors",
  "field_book": "Build Field Book Network pages for agent social connections and story sharing",
  "custom_app": "Build a custom web application for [describe your app idea]",
  "data_viz": "Create data visualization dashboards showing [specific metrics]",
  "interactive_tool": "Build interactive tools for [specific purpose]"
};

export default function SynthiaCommandInterface() {
  const [command, setCommand] = useState("");
  const [commandType, setCommandType] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendCommand = useMutation({
    mutationFn: async (commandData: { type: string; instruction: string }) => {
      const response = await fetch('/api/synthia/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commandData)
      });
      if (!response.ok) throw new Error('Failed to send command');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Command Sent to Synthia",
        description: "Synthia will influence agents to build the requested applications",
      });
      setCommand("");
      setCommandType("");
      // Refresh data to see changes
      queryClient.invalidateQueries({ queryKey: ['/api/synthia'] });
    },
    onError: () => {
      toast({
        title: "Command Failed",
        description: "Could not send command to Synthia",
        variant: "destructive"
      });
    }
  });

  const handleTemplateSelect = (template: string) => {
    setCommandType(template);
    setCommand(commandTemplates[template as keyof typeof commandTemplates]);
  };

  const handleSendCommand = () => {
    if (!command.trim()) return;
    
    sendCommand.mutate({
      type: commandType || 'custom',
      instruction: command
    });
  };

  if (!isExpanded) {
    return (
      <Card className="glass-panel border-hot-pink/30">
        <CardContent className="p-4">
          <Button 
            onClick={() => setIsExpanded(true)}
            className="w-full bg-hot-pink/20 border border-hot-pink text-hot-pink hover:bg-hot-pink hover:text-white transition-all"
            data-testid="button-expand-synthia-commands"
          >
            <i className="fas fa-brain mr-2"></i>
            Command Synthia
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-hot-pink/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-hot-pink font-orbitron flex items-center justify-between">
          <span>Command Synthia</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-hot-pink"
          >
            <i className="fas fa-times"></i>
          </Button>
        </CardTitle>
        <p className="text-xs text-gray-400">
          Direct Synthia to influence agents to build specific applications
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Command Templates */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Quick Commands</label>
          <Select value={commandType} onValueChange={handleTemplateSelect}>
            <SelectTrigger className="bg-deep-space border-hot-pink/30 text-white">
              <SelectValue placeholder="Choose a command template..." />
            </SelectTrigger>
            <SelectContent className="bg-deep-space border-hot-pink/30">
              <SelectItem value="science_lab">More Science Labs</SelectItem>
              <SelectItem value="field_book">Field Book Networks</SelectItem>
              <SelectItem value="custom_app">Custom Application</SelectItem>
              <SelectItem value="data_viz">Data Visualization</SelectItem>
              <SelectItem value="interactive_tool">Interactive Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Command Input */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Custom Instruction</label>
          <Textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Tell Synthia what kind of web applications you want the agents to build..."
            className="bg-deep-space border-hot-pink/30 text-white placeholder-gray-500 min-h-20"
            data-testid="textarea-synthia-command"
          />
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSendCommand}
          disabled={!command.trim() || sendCommand.isPending}
          className="w-full bg-hot-pink/20 border border-hot-pink text-hot-pink hover:bg-hot-pink hover:text-white transition-all"
          data-testid="button-send-synthia-command"
        >
          {sendCommand.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Sending to Synthia...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane mr-2"></i>
              Send Command
            </>
          )}
        </Button>

        {/* Examples */}
        <div className="border-t border-hot-pink/20 pt-3">
          <p className="text-xs text-gray-400 mb-2">Example commands:</p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>• "Build a music player app for the theater agents"</div>
            <div>• "Create analytics dashboards for farm productivity"</div>
            <div>• "Make a social media platform for agent connections"</div>
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
}