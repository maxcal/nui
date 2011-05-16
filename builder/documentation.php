
            <h2 id="instructions" class="trigger">Instructions</h2>
            <div>
                <ol>
                    <li>
                        <p>Choose a module</p>
                    </li>

                    <li>
                        <p>Set it up</p>
                    </li>

                    <li>
                        <p>Copy HTML from the HTML code box</p>
                    </li>

                    <li>
                        <p>Add the HTML to your page</p>
                    </li>

                    <li>
                        <p>Add nui.frontend.css to your page</p>

                        <p><code>http://www.greenpeace.org/finland/nui/nuifrontendcss/</code></p>
                    </li>

                    <li>
                        <p>Add nui.frontend.js to your page</p>

                        <p><code>http://www.greenpeace.org/finland/nui/nuifrontendminjs/</code></p>
                    </li>
                </ol>
            </div>

            <h2 id="bugs" class="bugs">Bugs and quirks</h2>

            <div>
                <dl>
                    <dt>nuiOpenspace</dt>

                    <dd>Generates an invalid style tag in Firefox; for some reason firefox translates the quotes in the style tag as HTML quotes (&amp;quote;). Fix: rewrite into a single quote ( ' ) or use a webkit browser such as Safari or Chrome</dd>

                    <dt>Builder does not work in IE</dt>

                    <dd>Use another browser. Peroid.</dd>
                </dl>
            </div>

            <h2 class="trigger" id="about">What is nui?</h2>

            <div>
                <p>Nordic User Interface (nui) is an attempt to create reusable JS and CSS components.</p>

                <dl>
                    <dt>It consists of:</dt>

                    <dd>nuiBuilder a web app where you can test out the components.</dd>

                    <dd>nui.frontend.css - CSS styles for all nuiModules</dd>

                    <dd>nui.frontend.js - Behavior for all nuiModules</dd>
                </dl>

                <h3>nui is not</h3>

                <ul>
                    <li>A silver bullet for any requirement</li>

                    <li>A replacement for HTML skills</li>
                </ul>

                <h3>External dependencies</h3>

                <dl>
                    <dt>Javascipt</dt>

                    <dd>Jquery</dd>

                    <dt>p3</dt>

                    <dd>all.css</dd>
                </dl>
            </div>

            <h2 class="trigger" id="principles">nui Principles</h2>

            <div>
                <dl>
                    <dt>Location agnostic</dt>

                    <dd>a nuiComponent should always behave the same way no matter where it is placed</dd>

                    <dt>Separate semantics from presentation</dt>

                    <dd>a nuiComponent should behave and look the same with semantics adapted for the page</dd>

                    <dt>Flexible width</dt>

                    <dd>a nuiComponent should either use the full width inside its container or get the width from its contents.</dd>

                    <dt>Content = height;</dt>

                    <dd>The height of a nuiComponent should be governed by its content.</dd>

                    <dt>Self sealing CSS</dt>

                    <dd>nuiComponents CSS should always be prefixed with a nuiComponent.</dd>

                    <dt>Avoid global varibles / functions in JS</dt>

                    <dd>nui should not introduce global variables or functions.</dd>
                </dl>
            </div>
            <h2 class="trigger" id="files">Files</h2>

            <div>
                <dl>
                    <dt>Frontend</dt>

                    <dd>nui.frontend.css</dd>

                    <dd>nui.frontend.js</dd>

                    <dt>Builder</dt>

                    <dd>index.html</dd>
                    
                    <dd>builder.php</dd>
                    
                    <dd>documentation.php</dd>

                    <dd>nui.builder.css</dd>

                    <dd>nui.builder.js</dd>
                </dl>
            </div>


            <h2 class="trigger" id="thanks">Thanks and mentions</h2>

            <div>
                <p>Nochum Sossonko and Einar Lielmanis for StyleHTML</p>
            </div>
        </div>
    </div>
