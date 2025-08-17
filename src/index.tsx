import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// In-memory storage for chat responses (you can upgrade to D1 database later)
const chatResponses = new Map([
  // Lighthouse Vision Loss Education Center CEO Search Q&A Database
  ['salary', 'CEO salary for Lighthouse Vision Loss Education Center typically ranges $150K-$300K base salary, depending on experience and organization size. Non-profit executive compensation includes competitive benefits, professional development opportunities, and the satisfaction of leading meaningful mission-driven work in vision loss education and support services.'],
  
  ['interview', 'Our CEO search process for Lighthouse Vision Loss Education Center includes: (1) Initial screening with our executive search team, (2) Comprehensive leadership assessment interview, (3) Board of Directors presentation and interview, (4) Stakeholder meetings with staff and community partners, (5) Vision and strategic planning discussion, (6) Reference checks with previous non-profit leadership roles. Timeline: 6-10 weeks total.'],
  
  ['benefits', 'Lighthouse Vision Loss Education Center CEO benefits typically include: Health/dental/vision insurance, retirement plan with matching, professional development budget, conference attendance, flexible work arrangements, sabbatical opportunities, and the unique reward of leading an organization that transforms lives in the vision loss community.'],
  
  ['qualifications', 'Ideal CEO candidates have: 10+ years senior leadership experience, preferably in non-profit organizations, experience serving individuals with disabilities or vision loss, proven fundraising and development track record, board governance experience, masters degree preferred, strategic planning expertise, and passion for vision loss education and advocacy.'],
  
  ['mission', 'Lighthouse Vision Loss Education Center provides comprehensive services to individuals who are blind or have low vision, including rehabilitation training, assistive technology, educational programs, employment services, and community advocacy. The CEO leads this vital mission serving the vision loss community with dignity and empowerment.'],
  
  ['responsibilities', 'CEO responsibilities include: Strategic leadership and vision setting, board relations and governance, fundraising and development oversight, staff management and organizational culture, community partnerships and advocacy, program quality assurance, financial stewardship, and representing the organization publicly as the primary spokesperson.'],
  
  ['timeline', 'Lighthouse Vision Loss Education Center CEO search timeline: Position posting and recruitment (2-3 weeks), application review and initial screening (2 weeks), first round interviews (1-2 weeks), board presentations and final interviews (2 weeks), reference checks and offer process (1 week). Total timeline: 8-10 weeks.'],
  
  ['confidentiality', 'Complete confidentiality maintained throughout the search process. Current employment information protected. Only candidates advancing to final rounds will have their information shared with the Lighthouse board, and only with explicit permission. Secure communications used throughout the process.'],
  
  ['location', 'Lighthouse Vision Loss Education Center is seeking a CEO for their main facility. Remote work flexibility may be available for certain aspects of the role, but significant on-site presence required for community engagement, staff leadership, and client services oversight.'],
  
  ['board', 'The Lighthouse Vision Loss Education Center is governed by an engaged board of directors committed to excellence in vision loss services. The CEO works closely with the board chair and full board on strategic planning, policy development, and organizational oversight. Board members bring diverse professional expertise and community connections.'],
  
  ['funding', 'Lighthouse Vision Loss Education Center operates on a mixed funding model including government contracts, foundation grants, individual donations, corporate partnerships, and fee-for-service programs. The CEO plays a key role in fundraising strategy and donor relations, working with development staff and board members.'],
  
  ['contact', 'Ready to learn more about the Lighthouse Vision Loss Education Center CEO opportunity? Contact F. Jay Hall directly: - Email: fjhall@execsearches.com - Phone: Available upon request - LinkedIn: Connect with ExecSearches - 25 years of executive search expertise serving mission-driven organizations.'],
  
  ['about', 'ExecSearches.com has 25+ years of executive search excellence, including extensive experience placing CEOs and senior leaders in non-profit organizations. Founded by F. Jay Hall (former Isaacson Miller consultant), we specialize in mission-driven leadership placements that create lasting organizational impact.']
])

// API endpoint for chat
app.post('/api/chat', async (c) => {
  const { message } = await c.req.json()
  
  if (!message) {
    return c.json({ error: 'Message is required' }, 400)
  }
  
  const lowerMessage = message.toLowerCase()
  let response = "I'm here to help with questions about the Lighthouse Vision Loss Education Center CEO position! Ask me about salary, qualifications, responsibilities, interview process, or organizational details. For specific information about applying, please contact F. Jay Hall directly."
  
  // Simple keyword matching for responses
  for (const [key, value] of chatResponses) {
    if (lowerMessage.includes(key)) {
      response = value
      break
    }
  }
  
  // Log the interaction
  console.log(`Chat Query: ${message} | Response: ${response.substring(0, 100)}...`)
  
  return c.json({ 
    response,
    timestamp: new Date().toISOString(),
    query: message
  })
})

// Admin API to manage responses
app.get('/api/admin/responses', (c) => {
  const responses = Array.from(chatResponses.entries()).map(([key, value]) => ({
    keyword: key,
    response: value
  }))
  return c.json({ responses })
})

app.post('/api/admin/responses', async (c) => {
  const { keyword, response } = await c.req.json()
  
  if (!keyword || !response) {
    return c.json({ error: 'Keyword and response are required' }, 400)
  }
  
  chatResponses.set(keyword.toLowerCase(), response)
  return c.json({ success: true, keyword, response })
})

app.delete('/api/admin/responses/:keyword', (c) => {
  const keyword = c.req.param('keyword').toLowerCase()
  const deleted = chatResponses.delete(keyword)
  
  if (deleted) {
    return c.json({ success: true, message: `Deleted keyword: ${keyword}` })
  } else {
    return c.json({ error: 'Keyword not found' }, 404)
  }
})

// Main chat interface with CORRECTED LAYOUT (questions at top, answers at bottom)
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ExecSearches.com - Lighthouse Vision Loss Education Center CEO Search</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'lighthouse-blue': '#1e40af',
                  'lighthouse-navy': '#1e3a8a',
                  'lighthouse-gold': '#f59e0b'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div class="container mx-auto px-4 py-8 max-w-4xl">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-lighthouse-navy mb-2">
                    <i class="fas fa-eye mr-3"></i>ExecSearches.com
                </h1>
                <p class="text-xl text-gray-700 font-semibold">Lighthouse Vision Loss Education Center</p>
                <p class="text-lg text-lighthouse-blue">CEO Search Chatbot</p>
                <p class="text-sm text-gray-600 mt-2">Ask me about salary, qualifications, responsibilities, or our CEO search process</p>
            </div>

            <!-- Chat Container -->
            <div class="bg-white rounded-lg shadow-xl overflow-hidden">
                <!-- Chat Header -->
                <div class="bg-lighthouse-blue text-white p-4">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                        <h2 class="text-lg font-semibold">Chat with F. Jay Hall's AI Assistant</h2>
                    </div>
                    <p class="text-blue-100 text-sm mt-1">CEO Search for Lighthouse Vision Loss Education Center</p>
                </div>

                <!-- Chat Input - NOW AT TOP -->
                <div class="p-4 border-b bg-gray-50">
                    <div class="flex space-x-3">
                        <input 
                            type="text" 
                            id="messageInput" 
                            placeholder="Ask about CEO salary, qualifications, responsibilities, or search process..."
                            class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lighthouse-blue focus:border-transparent outline-none"
                            onkeypress="if(event.key==='Enter') sendMessage()"
                        >
                        <button 
                            onclick="sendMessage()"
                            class="bg-lighthouse-blue text-white px-6 py-2 rounded-lg hover:bg-lighthouse-navy transition duration-200 font-medium"
                        >
                            <i class="fas fa-paper-plane mr-2"></i>Send
                        </button>
                    </div>
                </div>

                <!-- Quick Questions - BELOW INPUT -->
                <div class="px-4 py-3 bg-gray-50 border-b">
                    <p class="text-xs text-gray-600 mb-2 font-medium">Quick Questions:</p>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="sendQuickMessage('What is the CEO salary range?')" class="bg-lighthouse-gold bg-opacity-20 text-lighthouse-navy px-3 py-1 rounded-full text-sm hover:bg-lighthouse-gold hover:bg-opacity-30 transition font-medium">CEO Salary</button>
                        <button onclick="sendQuickMessage('What qualifications are required?')" class="bg-lighthouse-gold bg-opacity-20 text-lighthouse-navy px-3 py-1 rounded-full text-sm hover:bg-lighthouse-gold hover:bg-opacity-30 transition font-medium">Qualifications</button>
                        <button onclick="sendQuickMessage('What are the CEO responsibilities?')" class="bg-lighthouse-gold bg-opacity-20 text-lighthouse-navy px-3 py-1 rounded-full text-sm hover:bg-lighthouse-gold hover:bg-opacity-30 transition font-medium">Responsibilities</button>
                        <button onclick="sendQuickMessage('What is the interview process?')" class="bg-lighthouse-gold bg-opacity-20 text-lighthouse-navy px-3 py-1 rounded-full text-sm hover:bg-lighthouse-gold hover:bg-opacity-30 transition font-medium">Interview Process</button>
                    </div>
                </div>

                <!-- Chat Messages - NOW AT BOTTOM, QUESTIONS FLOW DOWN, ANSWERS BELOW -->
                <div id="chatMessages" class="h-96 overflow-y-auto p-4 space-y-4">
                    <div class="flex items-start space-x-3">
                        <div class="w-8 h-8 bg-lighthouse-blue rounded-full flex items-center justify-center">
                            <i class="fas fa-robot text-white text-sm"></i>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-3 max-w-md">
                            <p class="text-gray-800 font-medium">Welcome! I'm here to answer questions about the Lighthouse Vision Loss Education Center CEO position.</p>
                            <ul class="mt-2 text-sm text-gray-700 space-y-1">
                                <li>• CEO salary range and benefits</li>
                                <li>• Required qualifications and experience</li>
                                <li>• Leadership responsibilities</li>
                                <li>• Interview process and timeline</li>
                                <li>• Organization mission and culture</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center mt-8 text-gray-600">
                <p class="text-sm">
                    <i class="fas fa-shield-alt mr-2"></i>Confidential Executive Search Services
                    <span class="mx-2">•</span>
                    <a href="/admin" class="text-lighthouse-blue hover:underline font-medium">Admin Panel</a>
                </p>
                <p class="text-xs mt-2">F. Jay Hall - 25 Years of Executive Search Excellence</p>
                <p class="text-xs text-gray-500 mt-1">fjhall@execsearches.com</p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            async function sendMessage() {
                const input = document.getElementById('messageInput');
                const message = input.value.trim();
                
                if (!message) return;
                
                // Add user message to chat (questions appear first, flowing down)
                addMessageToChat(message, 'user');
                
                // Clear input
                input.value = '';
                
                // Show typing indicator
                const typingId = addTypingIndicator();
                
                try {
                    const response = await axios.post('/api/chat', { message });
                    removeTypingIndicator(typingId);
                    // Add bot response below the question
                    addMessageToChat(response.data.response, 'bot');
                } catch (error) {
                    removeTypingIndicator(typingId);
                    addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot', true);
                    console.error('Chat error:', error);
                }
            }
            
            function sendQuickMessage(message) {
                document.getElementById('messageInput').value = message;
                sendMessage();
            }
            
            function addMessageToChat(message, sender, isError = false) {
                const chatMessages = document.getElementById('chatMessages');
                const messageDiv = document.createElement('div');
                
                if (sender === 'user') {
                    // User message (question) - appears first, aligned right
                    messageDiv.innerHTML = \`
                        <div class="flex items-start space-x-3 justify-end mb-2">
                            <div class="bg-lighthouse-blue text-white rounded-lg p-3 max-w-md">
                                <p class="font-medium">\${message}</p>
                            </div>
                            <div class="w-8 h-8 bg-lighthouse-gold rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-white text-sm"></i>
                            </div>
                        </div>
                    \`;
                } else {
                    // Bot response (answer) - appears below question, aligned left
                    const bgColor = isError ? 'bg-red-100' : 'bg-gray-100';
                    const textColor = isError ? 'text-red-800' : 'text-gray-800';
                    messageDiv.innerHTML = \`
                        <div class="flex items-start space-x-3 mb-4">
                            <div class="w-8 h-8 bg-lighthouse-blue rounded-full flex items-center justify-center">
                                <i class="fas fa-robot text-white text-sm"></i>
                            </div>
                            <div class="\${bgColor} rounded-lg p-3 max-w-md">
                                <p class="\${textColor}">\${message}</p>
                            </div>
                        </div>
                    \`;
                }
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            function addTypingIndicator() {
                const chatMessages = document.getElementById('chatMessages');
                const typingDiv = document.createElement('div');
                const typingId = 'typing-' + Date.now();
                typingDiv.id = typingId;
                
                typingDiv.innerHTML = \`
                    <div class="flex items-start space-x-3">
                        <div class="w-8 h-8 bg-lighthouse-blue rounded-full flex items-center justify-center">
                            <i class="fas fa-robot text-white text-sm"></i>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-3">
                            <div class="flex space-x-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                            </div>
                        </div>
                    </div>
                \`;
                
                chatMessages.appendChild(typingDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                return typingId;
            }
            
            function removeTypingIndicator(typingId) {
                const typingElement = document.getElementById(typingId);
                if (typingElement) {
                    typingElement.remove();
                }
            }
            
            // Focus on input when page loads
            document.addEventListener('DOMContentLoaded', () => {
                document.getElementById('messageInput').focus();
            });
        </script>
    </body>
    </html>
  `)
})

// Admin panel for managing Q&A
app.get('/admin', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel - Lighthouse CEO Search Chatbot</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-4 py-8 max-w-6xl">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">
                        <i class="fas fa-cog mr-3"></i>Admin Panel
                    </h1>
                    <p class="text-gray-600">Manage Lighthouse CEO Search Chatbot Q&A</p>
                </div>
                <a href="/" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Chat
                </a>
            </div>

            <!-- Add New Response -->
            <div class="bg-white rounded-lg shadow p-6 mb-8">
                <h2 class="text-xl font-semibold mb-4">Add New Response</h2>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                        <input 
                            type="text" 
                            id="newKeyword" 
                            placeholder="e.g., salary, benefits, timeline, mission"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Response</label>
                        <textarea 
                            id="newResponse" 
                            rows="3"
                            placeholder="Enter the detailed response for this keyword..."
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                    </div>
                </div>
                <button 
                    onclick="addResponse()"
                    class="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    <i class="fas fa-plus mr-2"></i>Add Response
                </button>
            </div>

            <!-- Current Responses -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-semibold">Current Q&A Responses</h2>
                    <p class="text-gray-600 text-sm mt-1">Manage all chatbot responses for the Lighthouse CEO search</p>
                </div>
                <div id="responsesList" class="divide-y">
                    <!-- Responses will be loaded here -->
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            async function loadResponses() {
                try {
                    const response = await axios.get('/api/admin/responses');
                    const responsesList = document.getElementById('responsesList');
                    
                    if (response.data.responses.length === 0) {
                        responsesList.innerHTML = \`
                            <div class="p-6 text-center text-gray-500">
                                <i class="fas fa-inbox text-3xl mb-2"></i>
                                <p>No responses configured yet</p>
                            </div>
                        \`;
                        return;
                    }
                    
                    responsesList.innerHTML = response.data.responses.map(item => \`
                        <div class="p-6">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center mb-2">
                                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            \${item.keyword}
                                        </span>
                                    </div>
                                    <p class="text-gray-700 leading-relaxed">\${item.response}</p>
                                </div>
                                <button 
                                    onclick="deleteResponse('\${item.keyword}')"
                                    class="ml-4 text-red-600 hover:text-red-800 p-2"
                                    title="Delete response"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    \`).join('');
                } catch (error) {
                    console.error('Error loading responses:', error);
                }
            }
            
            async function addResponse() {
                const keyword = document.getElementById('newKeyword').value.trim();
                const response = document.getElementById('newResponse').value.trim();
                
                if (!keyword || !response) {
                    alert('Please fill in both keyword and response');
                    return;
                }
                
                try {
                    await axios.post('/api/admin/responses', { keyword, response });
                    
                    // Clear form
                    document.getElementById('newKeyword').value = '';
                    document.getElementById('newResponse').value = '';
                    
                    // Reload responses
                    loadResponses();
                    
                    alert('Response added successfully!');
                } catch (error) {
                    alert('Error adding response: ' + error.response?.data?.error || error.message);
                }
            }
            
            async function deleteResponse(keyword) {
                if (!confirm(\`Are you sure you want to delete the response for "\${keyword}"?\`)) {
                    return;
                }
                
                try {
                    await axios.delete(\`/api/admin/responses/\${encodeURIComponent(keyword)}\`);
                    loadResponses();
                    alert('Response deleted successfully!');
                } catch (error) {
                    alert('Error deleting response: ' + error.response?.data?.error || error.message);
                }
            }
            
            // Load responses when page loads
            document.addEventListener('DOMContentLoaded', loadResponses);
        </script>
    </body>
    </html>
  `)
})

export default app